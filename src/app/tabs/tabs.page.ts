import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from "../servicos/auth.service";

import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public podeAcessar: boolean = true;

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  estaLogado(): boolean {
    let myVar = this.authService.isAuthenticated;
    return myVar;
  }

  async logout(){
    await this.authService.logout()
    .then(() => {
      console.log("logout com sucesso.");
      this.router.navigate(["/login"]);
    })
    .catch((error) => {
      console.log("Ocorreu um erro no logout.");
    });
  }
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit() {
  }
}
