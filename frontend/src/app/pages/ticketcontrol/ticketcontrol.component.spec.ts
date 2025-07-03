import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketcontrolComponent } from './ticketcontrol.component';

describe('TicketcontrolComponent', () => {
  let component: TicketcontrolComponent;
  let fixture: ComponentFixture<TicketcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketcontrolComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
