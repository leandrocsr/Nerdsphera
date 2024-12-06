import { Injectable } from '@angular/core';
import { Firestore, collection, doc, docData, updateDoc, addDoc, collectionData, setDoc, deleteDoc, increment } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteracoesService {

  private readonly noticiasCollection = 'noticias';

  constructor(private firestore: Firestore) {}

  normalizeData(item: any, type: string): any {
    return {
      id: item.id,
      name: item.name || item.title || 'Título não disponível',
      releaseDate: item.releaseDate || 'Data não disponível',
      image: item.image || item.poster || 'assets/default-image.png',
      type: type,
      genre: item.genres || item.genre || 'Gênero não disponível',
      likes: item.likes || 0, 
      dislikes: item.dislikes || 0, 
    };
  }  

  saveNoticiaToFirestore(noticia: any): Promise<void> {
  const docRef = doc(this.firestore, `noticias/${noticia.id}`); // Cria um documento com ID único
  return setDoc(docRef, { 
    noticia: {
      id: noticia.id,
      name: noticia.name,
      releaseDate: noticia.releaseDate,
      image: noticia.image,
      type: noticia.type,
      genre: noticia.genre
    },
    likesCount: noticia.likesCount || 0, // Salva o contador de likes
    dislikesCount: noticia.dislikesCount || 0 // Salva o contador de dislikes
  });
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
  updateNewsLikesDislikes(noticiaId: string, voteData: { likes: number, dislikes: number }) {
    const docRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}`);
    
    // Atualiza os contadores de likes e dislikes
    return updateDoc(docRef, {
      likesCount: increment(voteData.likes),  // Incrementa os likes
      dislikesCount: increment(voteData.dislikes), // Incrementa os dislikes
    });
  }

  // Adicionar um comentário
  addComment(noticiaId: string, comment: any) {
    const commentsCollection = collection(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments`);
    return addDoc(commentsCollection, {comment, likesCount: 0, dislikesCount: 0});
  }

  // Atualizar likes ou dislikes de um comentário
  updateCommentLikesDislikes(noticiaId: string, commentId: string, like: boolean) {
    const docRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments/${commentId}`);
    
    // Atualiza os contadores de likes e dislikes
    return updateDoc(docRef, {
      likesCount: like ? increment(1) : increment(0),  // Aumenta o like
      dislikesCount: !like ? increment(1) : increment(0), // Aumenta o dislike
    });
  }

  // Obter comentários de uma notícia
  getComments(noticiaId: string): Observable<any[]> {
    const commentsCollection = collection(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments`);
    return collectionData(commentsCollection, { idField: 'id' });
  }

  deleteComment(noticiaId: string, commentId: string) {
    const docRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments/${commentId}`);
    return deleteDoc(docRef);
  }
  
}
