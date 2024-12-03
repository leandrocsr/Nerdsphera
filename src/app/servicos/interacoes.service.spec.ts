import { TestBed } from '@angular/core/testing';

import { InteracoesService } from './interacoes.service';

describe('InteracoesService', () => {
  let service: InteracoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteracoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
