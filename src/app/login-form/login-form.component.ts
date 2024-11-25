import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from "@ionic/angular";


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent  implements OnInit {

  constructor(private navController: NavController, private router: Router) { }

  login() {
    // Lógica de autenticação ou validação aqui (opcional)

    // Navega para a home page
    this.router.navigateByUrl('/tabs/noticias');
  }

  cadastrar() {
    this.router.navigateByUrl('/cadastro');
  }

  ngOnInit() {}

}
