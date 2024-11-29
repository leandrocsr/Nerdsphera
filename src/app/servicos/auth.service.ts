import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut } from '@angular/fire/auth';

@Injectable({providedIn: 'root'})

export class AutenticacaoService {
  public userLogin:any = "Sem Usuário";
  constructor ( private auth: Auth ) { }
  async loginNoFirebase( email:string, password:string){
  const user = await signInWithEmailAndPassword(this.auth, email, password );
  this.userLogin = user;
  return user;
  }
  async cadastroNoFirebase( email:string, password:string ) {
  const user = await createUserWithEmailAndPassword(this.auth, email, password );
  return user;
  }
}