import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryAreasComponent } from './delivery-areas.component';

describe('DeliveryAreasComponent', () => {
  let component: DeliveryAreasComponent;
  let fixture: ComponentFixture<DeliveryAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryAreasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
