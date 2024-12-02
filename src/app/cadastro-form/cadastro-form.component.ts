import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators} from "@angular/forms";
import { of, throwError } from "rxjs";

import { AutenticacaoService } from "../servicos/auth.service";
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro-form',
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.scss'],
})
export class CadastroFormComponent  implements OnInit {

  private mensagem:string = "";

  public formGroup: FormGroup = new FormGroup({
    email: new FormControl<string>("", {

      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(10),
        //Validators.maxLength(250),
        //Validators.minLength(5),
        //Validators.pattern(/.+@.+\..+/)
      ],
    }),
    senha: new FormControl<string>("", {

      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(6),
      ],
    }),
  });

  constructor ( 
    private authService: AutenticacaoService, 
    private router: Router, 
    private toastController: ToastController) {}
  cadastro(){
    const { email, senha } = this.formGroup.value;
    this.authService.cadastroNoFirebase (email, senha).then((res:any)=> {
      this.router.navigate(["/login"]);
    }).catch((error:any)=>{
      this.mensagem = "Erro ao incluir usuário." ;
      this.exibeMensagem ();
    })
  }
  async exibeMensagem (){
    const toast = await this.toastController .create({
      message: this.mensagem,
      duration: 2000
    });
    toast.present();
  }
  ngOnInit() {}
}