import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'noticias',
        loadChildren: () =>
          import('../noticias/noticias.module').then(m => m.NoticiasPageModule),
      },
      {
        path: 'filmes',
        loadChildren: () =>
          import('../filmes/filmes.module').then(m => m.FilmesPageModule),
      },
      {
        path: 'series',
        loadChildren: () =>
          import('../series/series.module').then(m => m.SeriesPageModule),
      },
      {
        path: 'jogos',
        loadChildren: () =>
          import('../jogos/jogos.module').then(m => m.JogosPageModule),
      },
      {
        path: 'noticia-detalhes/:id',
        loadChildren: () => 
          import('../noticia-detalhes/noticia-detalhes.module').then(m => m.NoticiaDetalhesPageModule)
      },
      {
        path: '',
        redirectTo: 'noticias', // Redireciona para 'noticias' ao acessar '/tabs'
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs', // Redireciona para '/tabs' ao acessar a raiz
    pathMatch: 'full',
  },
  {
    path: 'sobre',
    loadChildren: () =>
      import('../sobre/sobre.module').then(m => m.SobrePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
