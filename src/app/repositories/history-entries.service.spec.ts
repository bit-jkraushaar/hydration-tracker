import { TestBed } from '@angular/core/testing';

import { HistoryEntriesService } from './history-entries.service';

describe('DatabaseService', () => {
  let service: HistoryEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryEntriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
