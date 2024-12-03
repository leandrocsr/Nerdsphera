import { Injectable } from '@angular/core';
import { Firestore, collection, doc, docData, updateDoc, addDoc, collectionData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteracoesService {

  private readonly noticiasCollection = 'noticias';

  constructor(private firestore: Firestore) {}

  saveNoticiaToFirestore(noticia: any): Promise<void> {
    const docRef = doc(this.firestore, `noticias/${noticia.id}`); // ID único baseado na notícia
    return setDoc(docRef, noticia); // Salva ou substitui a notícia no Firestore
  }

  getNoticiaById(id: string): Observable<any> {
    const docRef = doc(this.firestore, `noticias/${id}`);
    return docData(docRef, { idField: 'id' }); // Retorna o documento como observable
  }

  // Obter todas as notícias
  getLatestNews(): Observable<any[]> {
    const collectionRef = collection(this.firestore, this.noticiasCollection);
    return collectionData(collectionRef, { idField: 'id' });
  }

  // Atualizar avaliação da notícia
  updateRating(noticiaId: string, rating: number) {
    const docRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}`);
    return updateDoc(docRef, { rating });
  }

  // Adicionar um comentário
  addComment(noticiaId: string, comment: any) {
    const commentsCollection = collection(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments`);
    return addDoc(commentsCollection, comment);
  }

  // Atualizar likes ou dislikes de um comentário
  updateCommentVotes(noticiaId: string, commentId: string, likes: number, dislikes: number) {
    const docRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments/${commentId}`);
    return updateDoc(docRef, { likes, dislikes });
  }

  // Obter comentários de uma notícia
  getComments(noticiaId: string): Observable<any[]> {
    const commentsCollection = collection(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments`);
    return collectionData(commentsCollection, { idField: 'id' });
  }
}
