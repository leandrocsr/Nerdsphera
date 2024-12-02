import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut } from '@angular/fire/auth';

@Injectable({providedIn: 'root'})

export class AutenticacaoService {
  public userLogin:any = "Sem Usuário";

  constructor ( private auth: Auth ) { }

  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /* logout() {
    this.auth.signOut()
    .then(() => {
    return true; // Logout successful
    })
    .catch((error) => {
    return false; // An error occurred
    });
  } */

  logout() {
    const resp = this.auth.signOut();
    console.log("logout resp = " , resp );
    return resp;
  }

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