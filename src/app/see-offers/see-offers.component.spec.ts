import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeOffersComponent } from './see-offers.component';

describe('SeeOffersComponent', () => {
  let component: SeeOffersComponent;
  let fixture: ComponentFixture<SeeOffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeOffersComponent]
    });
    fixture = TestBed.createComponent(SeeOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
