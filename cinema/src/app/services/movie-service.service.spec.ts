import { TestBed } from '@angular/core/testing';

import { MovieRestService } from './movie-rest.service';

describe('MovieServiceService', () => {
  let service: MovieRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
