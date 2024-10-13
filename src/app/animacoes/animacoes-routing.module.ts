import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimacoesPage } from './animacoes.page';

const routes: Routes = [
  {
    path: '',
    component: AnimacoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimacoesPageRoutingModule {}
