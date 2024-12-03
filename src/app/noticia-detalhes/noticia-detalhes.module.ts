import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticiaDetalhesPageRoutingModule } from './noticia-detalhes-routing.module';

import { NoticiaDetalhesPage } from './noticia-detalhes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticiaDetalhesPageRoutingModule
  ],
  declarations: [NoticiaDetalhesPage]
})
export class NoticiaDetalhesPageModule {}
