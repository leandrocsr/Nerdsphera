import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importações do Firebase
import { initializeApp } from 'firebase/app'; 
import { getAnalytics } from 'firebase/analytics'; 
import { provideAuth, getAuth } from '@angular/fire/auth';  
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from "@angular/fire/compat/auth";


import { environment } from '../environments/environment';

// Importação do AngularFire
import { provideDatabase, getDatabase } from '@angular/fire/database';  
import { provideFirestore, getFirestore } from '@angular/fire/firestore';  
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Provedores do Firebase
    provideAuth(() => getAuth()),  // Inicializa o Firebase Auth
    provideDatabase(() => getDatabase()),  // Se usar Realtime Database
    provideFirestore(() => getFirestore()),  // Se usar Firestore
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // Inicializa o Firebase
    const app = initializeApp(environment.firebaseConfig);
    getAnalytics(app);  // Caso precise ativar Google Analytics
  }
}
