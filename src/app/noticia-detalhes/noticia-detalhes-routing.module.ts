import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticiaDetalhesPage } from './noticia-detalhes.page';

const routes: Routes = [
  {
    path: '',
    component: NoticiaDetalhesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticiaDetalhesPageRoutingModule {}
