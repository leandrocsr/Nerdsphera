import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  public userLogin: any = "Sem Usuário";

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Verifica se o usuário está autenticado
  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Logout do usuário
  logout() {
    return this.auth.signOut().then(() => {
      console.log("Usuário deslogado com sucesso.");
    }).catch(error => {
      console.error("Erro ao deslogar:", error);
    });
  }

  // Login de usuário existente
  async loginNoFirebase(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.userLogin = userCredential.user;
    console.log("Usuário logado:", userCredential.user);

    // (Opcional) Buscar informações adicionais do Firestore
    const userDoc = doc(this.firestore, `usuarios/${userCredential.user.uid}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      console.log("Informações do usuário no Firestore:", userSnapshot.data());
    }

    return userCredential.user;
  }

  // Cadastro de novo usuário
  async cadastroNoFirebase(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Criação do documento do usuário no Firestore
    const user = userCredential.user;
    const userDoc = doc(this.firestore, `usuarios/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      nome: "Novo Usuário", // Você pode solicitar o nome no cadastro
      fotoPerfil: "",       // Você pode adicionar uma foto padrão ou deixar vazio
    };

    await setDoc(userDoc, userData);
    console.log("Novo usuário salvo no Firestore:", userData);

    return user;
  }
}
