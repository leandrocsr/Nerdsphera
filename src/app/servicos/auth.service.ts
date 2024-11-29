import { Injectable } from '@angular/core';
import { AngularFireAuth } from “@angular/fire/compat/auth”;
@Injectable({
providedIn: 'root'
})
export class AutenticacaoService {
  constructor(public ngFireAuth: AngularFireAuth ) { }
  loginNoFireBase(email, password){
  return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }
  cadastroNoFirebase(email, password){
  return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }
}