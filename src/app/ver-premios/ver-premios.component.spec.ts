import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPremiosComponent } from './ver-premios.component';

describe('VerPremiosComponent', () => {
  let component: VerPremiosComponent;
  let fixture: ComponentFixture<VerPremiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPremiosComponent]
    });
    fixture = TestBed.createComponent(VerPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
