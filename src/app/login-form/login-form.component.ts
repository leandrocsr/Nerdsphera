import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { AutenticacaoService } from '../servicos/auth.service';
import { ToastController } from '@ionic/angular' ;


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent  implements OnInit {
  public email:string = "";
  public senha:string = "";
  public mensagem:string = "";
  
  constructor ( 
    private authService : AutenticacaoService , 
    private router: Router, 
    private toastController : ToastController ) { }


  /* constructor(private navController: NavController, private router: Router) { } */

  loginUsuario (){
    this.authService.loginNoFirebase(this.email,
    this.senha)
    .then((res)=> {
      console.log("res = ", res);
      this.router.navigate(["/tabs"]);
    }).catch((error)=>{
      console.log("error = ", error);
      this.mensagem = "Erro ao fazer login do usuário." ;
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

  /* login() {
    this.router.navigateByUrl('/tabs/noticias');
  } */

  /* cadastroPage (){
    this.router.navigate(["/cadastro" ]);
  } */

  ngOnInit() {}

}