import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimacoesPageRoutingModule } from './animacoes-routing.module';

import { AnimacoesPage } from './animacoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimacoesPageRoutingModule
  ],
  declarations: [AnimacoesPage]
})
export class AnimacoesPageModule {}
