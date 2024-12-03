import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticiaDetalhesPage } from './noticia-detalhes.page';

describe('NoticiaDetalhesPage', () => {
  let component: NoticiaDetalhesPage;
  let fixture: ComponentFixture<NoticiaDetalhesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaDetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
