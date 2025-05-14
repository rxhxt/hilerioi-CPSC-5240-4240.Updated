import { TestBed } from '@angular/core/testing';

import { JobproxyService } from './jobproxy.service';

describe('JobproxyService', () => {
  let service: JobproxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobproxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
