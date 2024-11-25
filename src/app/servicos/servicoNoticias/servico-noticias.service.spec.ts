import { TestBed } from '@angular/core/testing';

import { ServicoNoticiasService } from './servico-noticias.service';

describe('ServicoNoticiasService', () => {
  let service: ServicoNoticiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoNoticiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
