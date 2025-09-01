import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CountryService, CountryCode } from '../../services/country.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  
  countries: CountryCode[] = [];
  selectedCountry: CountryCode | undefined;
  showCountryDropdown = false;
  
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  
  errorMessage: string = '';
  isLoading: boolean = false;
  verifiedPhone: string = '';
  returnUrl: string = '/profile';
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private countryService: CountryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.signupForm = this.fb.group({
      // Personal Information
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      
      // Address Information
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      
      // Password & Preferences
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]],
      notifications: [true],
      termsAccepted: [false, [Validators.requiredTrue]]
    }, {
      validators: SignupComponent.passwordMatchValidator
    });
    
    // Check for parameters passed from login component (for pre-verified phone)
    this.route.queryParams.subscribe(params => {
      if (params['phone'] && params['verified']) {
        this.verifiedPhone = params['phone'];
        // Pre-fill the phone field
        this.signupForm.patchValue({ phone: this.verifiedPhone });
      }
      
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      } else {
        this.returnUrl = '/profile'; // Default to profile page
      }
    });
  }

  static passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('passwordConfirm')?.value;
    
    if (password !== confirmPassword) {
      form.get('passwordConfirm')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  get stepOneValid(): boolean {
    return this.signupForm.get('name')?.valid === true && 
           this.signupForm.get('email')?.valid === true && 
           this.signupForm.get('phone')?.valid === true;
  }
  
  get stepTwoValid(): boolean {
    return this.signupForm.get('address')?.valid === true && 
           this.signupForm.get('city')?.valid === true && 
           this.signupForm.get('state')?.valid === true && 
           this.signupForm.get('pincode')?.valid === true;
  }
  
  get stepThreeValid(): boolean {
    return this.signupForm.get('password')?.valid === true && 
           this.signupForm.get('passwordConfirm')?.valid === true && 
           !this.signupForm.hasError('passwordMismatch') &&
           this.signupForm.get('termsAccepted')?.valid === true;
  }
  
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // For step 1, basic phone validation
      if (this.currentStep === 1) {
        const phoneValue = this.signupForm.get('phone')?.value;
        // Basic validation - check if the number has at least 5 digits
        if (!phoneValue || phoneValue.length < 5) {
          this.signupForm.get('phone')?.setErrors({ invalidPhoneNumber: true });
          return;
        }
      }
      
      if ((this.currentStep === 1 && this.stepOneValid) || 
          (this.currentStep === 2 && this.stepTwoValid)) {
        this.currentStep++;
      }
    }
  }
  
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  onSubmit(): void {
    this.errorMessage = '';
    
    // Validate phone number (basic validation)
    const phoneValue = this.signupForm.get('phone')?.value;
    if ((!phoneValue || phoneValue.length < 5)) {
      this.signupForm.get('phone')?.setErrors({ invalidPhoneNumber: true });
      return;
    }

    if (this.signupForm.valid) {
      this.isLoading = true;
      
      // Format phone with country code if needed
      let formattedNumber = phoneValue;
      if (this.selectedCountry && !phoneValue.includes('+')) {
        formattedNumber = `${this.selectedCountry.dialCode}${phoneValue}`;
      }
      
      // Create a copy of the form data with the formatted phone
      const userData = {...this.signupForm.value, phone: formattedNumber};
      
      // Include a flag if the phone was pre-verified through OTP
      const isPhonePreVerified = !!this.verifiedPhone;
      if (isPhonePreVerified) {
        userData.phoneVerified = true;
      }
      
      // Call the auth service to register the user
      this.authService.register(userData, isPhonePreVerified).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.token) {
            // User registered and logged in successfully
            console.log("Registration successful with token, navigating to:", this.returnUrl);
            this.router.navigateByUrl(this.returnUrl);
          } else {
            // Registration successful but no auto-login
            console.log("Registration successful without token, navigating to login");
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Registration error:", error);
          
          // Special handling for common errors
          if (error.error?.message?.includes('email') && error.error?.message?.includes('already')) {
            this.errorMessage = "This email is already registered. If this is your account, please try logging in instead.";
            // Provide an easy way to go back to login
            setTimeout(() => {
              if (confirm("This account already exists. Would you like to go to the login page instead?")) {
                this.router.navigate(['/login']);
              }
            }, 200);
          } else if (error.error?.message?.includes('phone') && error.error?.message?.includes('already')) {
            this.errorMessage = "This phone number is already registered but with a different email. Please try logging in or use a different phone number.";
            // Provide an easy way to go back to login
            setTimeout(() => {
              if (confirm("This phone number is already registered. Would you like to go to the login page instead?")) {
                this.router.navigate(['/login']);
              }
            }, 200);
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
    }
  }
  
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  ngOnInit(): void {
    // Load countries
    this.countries = this.countryService.getAllCountries();
    // Set default country to India
    this.selectedCountry = this.countryService.getCountryByCode('IN') || 
                           this.countryService.getCountryByCode('GB');
  }
  
  ngAfterViewInit(): void {
    this.initializePhoneInput();
  }
  
  initializePhoneInput(): void {
    // Our custom implementation now uses the CountryService directly
    // so we don't need the intlTelInput library anymore
    
    // Load countries
    this.countries = this.countryService.getAllCountries();
    
    // Set default country to India
    this.selectedCountry = this.countryService.getCountryByCode('IN') || 
                           this.countryService.getCountryByCode('GB');
    
    // Handle input formatting for phone numbers
    if (this.phoneInput && this.phoneInput.nativeElement) {
      this.phoneInput.nativeElement.addEventListener('input', () => {
        const value = this.phoneInput.nativeElement.value;
        // Only digits
        const formattedValue = value.replace(/[^\d]/g, '');
        if (formattedValue !== value) {
          this.signupForm.get('phone')?.setValue(formattedValue);
        }
      });
    }
  }
  
  updateSelectedCountry(countryCode: string): void {
    this.selectedCountry = this.countryService.getCountryByCode(countryCode);
    this.showCountryDropdown = false;
  }
  
  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }
  
  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
    
    // Clear the input and focus it
    this.signupForm.get('phone')?.setValue('');
    if (this.phoneInput && this.phoneInput.nativeElement) {
      this.phoneInput.nativeElement.focus();
      this.cdr.detectChanges();
    }
  }
}
