import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService } from "../servicos/auth.service";
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-form',
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss'],
})
export class CadastroFormComponent implements OnInit {

  private mensagem: string = "";

  public formGroup: FormGroup = new FormGroup({
    nome: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
      ],
    }),
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
      ],
    }),
    senha: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
      ],
    }),
    fotoPerfil: new FormControl<File | null>(null, {
      nonNullable: true,
    }),
  });

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastController: ToastController
  ) {}

  cadastro() {
    const { nome, email, senha } = this.formGroup.value;
  
    if (!nome || !email || !senha) {
      this.mensagem = "Preencha todos os campos.";
      this.exibeMensagem();
      return;
    }
  
    this.authService.cadastroNoFirebase(email, senha)
      .then((user) => {
        const userId = user.uid;
        // Salvar o nome de usuário no Firestore
        return this.authService.salvarUsuarioFirestore(userId, {
          nome,
          email,
        });
      })
      .then(() => {
        this.router.navigate(["/login"]);
      })
      .catch((error) => {
        console.error("Erro ao cadastrar:", error);
        this.mensagem = "Erro ao incluir usuário.";
        this.exibeMensagem();
      });
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
