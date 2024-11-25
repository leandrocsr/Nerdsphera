import { TestBed } from '@angular/core/testing';

import { OpenCriticService } from './open-critic.service';

describe('OpenCriticService', () => {
  let service: OpenCriticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenCriticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
