import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from "../servicos/auth.service";

import { Router } from "@angular/router";
import { ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public podeAcessar: boolean = true;
  public menuAberto: boolean = false;
  public nomeUsuario: string | null = null;

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) { }



  abrirMenu(event: Event) {
    event.stopPropagation();
    this.menuAberto = true;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

  estaLogado(): boolean {
    let myVar = this.authService.isAuthenticated;
    return myVar;
  }

  async irPara(caminho: string) {
    this.router.navigate([`/tabs/${caminho}`]);
    this.menuAberto = false; 
  }

  async sair() {
    this.menuAberto = false
    const alert = document.createElement('ion-alert');
    alert.header = 'Sair';
    alert.message = 'Gostaria de sair?';
    alert.buttons = [
      {
        text: 'Não',
        role: 'cancel',
      },
      {
        text: 'Sim',
        handler: () => this.logout(),
      },
    ];
    document.body.appendChild(alert);
    await alert.present();
  }



  logout() {
    this.authService.limparUsuarioLogado();
    this.router.navigate(['/login']);
  }

  /* async confirmLogout() {
    await this.authService.logout()
      .then(() => {
        console.log("Logout com sucesso.");
        this.router.navigate(["/login"]);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  }
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  } */

  ngOnInit() {
    const usuario = this.authService.getUsuarioLogado();
    this.nomeUsuario = usuario?.nome || 'Usuário';
  }
}
