import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogView } from './audit-log-view';

describe('AuditLogView', () => {
  let component: AuditLogView;
  let fixture: ComponentFixture<AuditLogView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
