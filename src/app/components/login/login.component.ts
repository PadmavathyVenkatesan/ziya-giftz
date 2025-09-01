import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CountryService, CountryCode } from '../../services/country.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  otpSent = false;
  otpControls: FormControl[] = [];

  countries: CountryCode[] = [];
  selectedCountry: CountryCode | undefined;
  showCountryDropdown = false;

  errorMessage: string = '';
  isLoading = false;

  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private countryService: CountryService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // Get return url from route parameters or default to '/profile' which serves as our dashboard
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/profile';
    });
    this.loginForm = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });

    // Create 6 form controls for OTP
    for (let i = 0; i < 6; i++) {
      this.otpControls.push(new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]$')
      ]));
    }

    // Load countries
    this.countries = this.countryService.getAllCountries();
    // Set default country to India
    this.selectedCountry = this.countryService.getCountryByCode('IN');
  }

  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  selectCountry(country: CountryCode) {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.otpSent) {
      // Verify OTP
      if (this.isOtpValid()) {
        this.isLoading = true;
        const otpValue = this.otpControls.map(control => control.value).join('');

        // Format phone with country code if needed
        let phoneValue = this.loginForm.value.phone;
        let formattedNumber = phoneValue;
        if (this.selectedCountry && !phoneValue.includes('+')) {
          formattedNumber = `${this.selectedCountry.dialCode}${phoneValue}`;
        }

        this.authService.verifyOtp(
          formattedNumber,
          '',  // We're already formatting the full number above
          otpValue
        ).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log("OTP verification response:", response);

            if (response.token) {
              // User is logged in successfully - this is the normal flow for existing users
              console.log("Login successful with token:", response.token.substring(0, 20) + '...');

              // Store raw token without Bearer prefix
              localStorage.setItem('token', response.token);

              console.log("Token stored in localStorage:", localStorage.getItem('token')?.substring(0, 20) + '...');

              // Debug auth state
              this.authService.debugAuthState();

              // Force a small delay to ensure token is properly stored and processed
              setTimeout(() => {
                // Navigate to profile/dashboard
                console.log("Redirecting to dashboard at:", this.returnUrl);
                this.router.navigateByUrl(this.returnUrl || '/profile');
              }, 200);

            } else if (response.verified === true && (response.user === false || response.user === null)) {
              // Only redirect to signup if the API explicitly tells us this is a new user
              // User authenticated but not registered - redirect to complete signup
              console.log("Phone verified but user doesn't exist - redirecting to signup");
              console.log("Full response from verify-otp:", JSON.stringify(response));

              // Show error message first
              this.errorMessage = "This phone number is not registered. Please create a new account.";

              // Confirm with user before redirecting to signup
              setTimeout(() => {
                const confirmNewAccount = confirm("This phone number is not linked to an existing account. Would you like to create a new account with this number?");

                if (confirmNewAccount) {
                  this.router.navigate(['/signup'], {
                    queryParams: {
                      phone: formattedNumber,
                      verified: true,
                      returnUrl: this.returnUrl || '/profile'
                    }
                  });
                } else {
                  // User declined to create new account, reset OTP flow
                  this.otpSent = false;
                  this.otpControls.forEach(control => control.setValue(''));
                }
              }, 500);
            } else {
              // Default fallback - assume user exists and login was successful
              console.log("Default navigation to dashboard at:", this.returnUrl);

              // Add fallback for unexpected response format
              if (!localStorage.getItem('token') && response.data?.token) {
                localStorage.setItem('token', response.data.token);
                console.log("Token found in alternate response format and stored");
              }

              this.router.navigateByUrl(this.returnUrl || '/profile');
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error("OTP verification error:", error);
            this.errorMessage = error.error?.message || 'Failed to verify OTP. Please try again.';
          }
        });
      }
    } else {
      // Send OTP
      if (this.loginForm.valid) {
        this.isLoading = true;

        // Format phone with country code if needed
        let phoneValue = this.loginForm.value.phone;
        let formattedNumber = phoneValue;
        if (this.selectedCountry && !phoneValue.includes('+')) {
          formattedNumber = `${this.selectedCountry.dialCode}${phoneValue}`;
        }

        // First check if phone exists in system
        // Note: This requires a new backend endpoint - if not available,
        // we'll proceed with normal OTP flow
        this.authService.sendOtp(
          formattedNumber,
          ''  // We're already formatting the full number above
        ).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.otpSent = true;

            // For development, if OTP is returned in the response, auto-fill it
            if (response.code) {
              const otpString = response.code.toString();
              for (let i = 0; i < this.otpControls.length; i++) {
                if (i < otpString.length) {
                  this.otpControls[i].setValue(otpString[i]);
                }
              }
            }

            // If response contains userExists flag, show appropriate message
            if (response.hasOwnProperty('userExists') && response.userExists === false) {
              // Show a warning that this will create a new account
              this.errorMessage = "This phone number is not registered. After verification, you'll be prompted to create an account.";
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
          }
        });
      }
    }
  }

  onOtpDigitInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // If input is a digit and not empty
    if (/^\d$/.test(value)) {
      // Move focus to next input if not the last one
      if (index < this.otpControls.length - 1) {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (!event.clipboardData) return;

    const pastedData = event.clipboardData.getData('text').trim();
    if (!pastedData) return;

    // If the pasted data is digits and has correct length
    if (/^\d+$/.test(pastedData) && pastedData.length === this.otpControls.length) {
      // Fill the OTP inputs
      for (let i = 0; i < this.otpControls.length; i++) {
        this.otpControls[i].setValue(pastedData.charAt(i));
      }
    }
  }

  isOtpValid(): boolean {
    return this.otpControls.every(control => control.valid);
  }

  resendOtp() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.sendOtp(
      this.loginForm.value.phone,
      this.selectedCountry?.dialCode || '+91'
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Clear existing OTP fields
        this.otpControls.forEach(control => control.setValue(''));

        // For development, if OTP is returned in the response, auto-fill it
        if (response.code) {
          const otpString = response.code.toString();
          for (let i = 0; i < this.otpControls.length; i++) {
            if (i < otpString.length) {
              this.otpControls[i].setValue(otpString[i]);
            }
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }
}
