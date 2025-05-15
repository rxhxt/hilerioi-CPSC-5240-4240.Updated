import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistingsComponent } from './joblistings.component';

describe('JoblistingsComponent', () => {
  let component: JoblistingsComponent;
  let fixture: ComponentFixture<JoblistingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoblistingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoblistingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
