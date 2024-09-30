import { TestBed } from '@angular/core/testing';

import { FormcvService } from './formcv.service';

describe('FormcvService', () => {
  let service: FormcvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormcvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
