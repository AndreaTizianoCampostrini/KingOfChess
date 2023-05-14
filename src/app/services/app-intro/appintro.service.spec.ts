import { TestBed } from '@angular/core/testing';

import { AppintroService } from './appintro.service';

describe('AppintroService', () => {
  let service: AppintroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppintroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
