import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'noticias',
        children: [
          {
            path: '',
            loadChildren: () => import('../noticias/noticias.module').then(m => m.NoticiasPageModule)
          }
        ]
      },
      {
        path: 'filmes',
        children: [
          {
            path: '',
            loadChildren: () => import('../filmes/filmes.module').then(m => m.FilmesPageModule)
          }
        ]
      },
      {
        path: 'series',
        children: [
          {
            path: '',
            loadChildren: () => import('../series/series.module').then(m => m.SeriesPageModule)
          }
        ]
      },
      {
        path: 'jogos',
        children: [
          {
            path: '',
            loadChildren: () => import('../jogos/jogos.module').then(m => m.JogosPageModule)
          }
        ]
      },
      {
        path: 'animacoes',
        children: [
          {
            path: '',
            loadChildren: () => import('../animacoes/animacoes.module').then(m => m.AnimacoesPageModule)
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/noticias',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
