import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection } from '@angular/fire/firestore';
/* import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'; */

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  public userLogin: any = "Sem Usuário";
  private usuarioLogado: Usuario | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore, 
  ) {}

  setUsuarioLogado(userData: Usuario): void {
    this.usuarioLogado = userData;
    localStorage.setItem('usuarioLogado', JSON.stringify(userData)); // Persistindo os dados localmente.
  }

  getUsuarioLogado(): Usuario | null {
    if (!this.usuarioLogado) {
      const userData = localStorage.getItem('usuarioLogado');
      this.usuarioLogado = userData ? JSON.parse(userData) : null;
    }
    return this.usuarioLogado;
  }

  limparUsuarioLogado(): void {
    this.usuarioLogado = null;
    localStorage.removeItem('usuarioLogado'); // Limpa os dados ao fazer logout.
  }

  // Verifica se o usuário está autenticado
  get isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Logout do usuário
  logout() {
    return signOut(this.auth).then(() => {
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

    // Buscar informações adicionais do Firestore
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
      /* fotoPerfil: "",       // Você pode adicionar uma foto padrão ou deixar vazio */
    };

    await setDoc(userDoc, userData);
    console.log("Novo usuário salvo no Firestore:", userData);

    return user;
  }

  // Salvar informações do usuário no Firestore
  salvarUsuarioFirestore(userId: string, userData: any): Promise<void> {
    const userDoc = doc(this.firestore, `usuarios/${userId}`);
    return setDoc(userDoc, userData);
  }

  // Buscar informações do Firestore
  async getUsuarioFirestore(userId: string): Promise<any> {
    const userDoc = doc(this.firestore, `usuarios/${userId}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      throw new Error("Usuário não encontrado.");
    }
  }

  // Upload da foto de perfil para o Firebase Storage
  /* uploadFotoPerfil(foto: File, userId: string): Promise<string> {
    const fotoRef = ref(this.storage, `usuarios/${userId}/fotoPerfil.jpg`);
    return uploadBytes(fotoRef, foto).then(() => getDownloadURL(fotoRef));
  } */
}

export interface Usuario {
  nome: string;
  email: string;
  fotoPerfil?: string; // Opcional, para incluir futuramente.
}
