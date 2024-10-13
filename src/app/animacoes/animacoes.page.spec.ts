import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimacoesPage } from './animacoes.page';

describe('AnimacoesPage', () => {
  let component: AnimacoesPage;
  let fixture: ComponentFixture<AnimacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
