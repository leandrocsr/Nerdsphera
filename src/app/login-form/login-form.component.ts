import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../servicos/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  public email: string = "";
  public senha: string = "";
  public mensagem: string = "";

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  loginUsuario() {
    this.authService.loginNoFirebase(this.email, this.senha)
    .then((user) => {
      // Após o login bem-sucedido, buscar dados adicionais do Firestore
      const userId = user.uid;
      const userData = {
        nome: "Usuário", // Caso queira um nome padrão se não existir no Firestore
        ...user,
      };
      this.authService.getUsuarioFirestore(userId).then((userData) => {
        const userDataSimplificado = {
          nome: userData.nome,
          email: userData.email,
          fotoPerfil: userData.fotoPerfil,
        };
        this.authService.setUsuarioLogado(userData);
        this.router.navigate(["/tabs"]);
      });
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      this.mensagem = this.getMensagemErro(error.code);
      this.exibeMensagem();
    });
  }

  getMensagemErro(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado!';
      case 'auth/wrong-password':
        return 'Senha incorreta!';
      case 'auth/invalid-email':
        return 'E-mail inválido!';
      default:
        return 'Erro desconhecido no login.';
    }
  }

  async exibeMensagem() {
    const toast = await this.toastController.create({
      message: this.mensagem,
      duration: 2000,
    });
    toast.present();
  }

  ngOnInit() {}
}
