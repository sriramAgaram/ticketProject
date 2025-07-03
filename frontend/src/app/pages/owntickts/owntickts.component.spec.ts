import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnticktsComponent } from './owntickts.component';

describe('OwnticktsComponent', () => {
  let component: OwnticktsComponent;
  let fixture: ComponentFixture<OwnticktsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnticktsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnticktsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
