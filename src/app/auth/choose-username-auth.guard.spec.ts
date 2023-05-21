import { TestBed } from '@angular/core/testing';

import { ChooseUsernameAuthGuard } from './choose-username-auth.guard';

describe('ChooseUsernameAuthGuard', () => {
  let guard: ChooseUsernameAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChooseUsernameAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
