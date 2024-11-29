import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importações do Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAnalytics } from 'firebase/analytics'; 
import { provideAuth, getAuth } from '@angular/fire/auth';
  




import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, 
  ],
  providers: [ 
    provideFirebaseApp(() =>
    initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
