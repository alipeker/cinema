import { TestBed } from '@angular/core/testing';

import { RabbitmqService } from './rabbitmq.service';

describe('RabbitmqService', () => {
  let service: RabbitmqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RabbitmqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
