import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, docData, updateDoc, addDoc, collectionData, setDoc, deleteDoc, increment, serverTimestamp, CollectionReference, query, orderBy} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AutenticacaoService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InteracoesService {
  private readonly noticiasCollection = 'noticias';

  constructor(private firestore: Firestore, private authService: AutenticacaoService) {}

  async addComment(noticiaId: string, comment: any) {

    const usuarioLogado = this.authService.getUsuarioLogado(); // Obtém o usuário logado
    if (!usuarioLogado) {
      throw new Error('Usuário não está autenticado.');
    }
    // Referência do documento da notícia
    const noticiaDocRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}`);
  
    try {
      // Verificar se o documento da notícia já existe
      const noticiaSnapshot = await getDoc(noticiaDocRef);
  
      // Se a notícia não existir, cria um novo documento na coleção "noticias"
      if (!noticiaSnapshot.exists()) {
        // Cria o documento da notícia com os dados iniciais (se necessário)
        await setDoc(noticiaDocRef, { 
          id: noticiaId,
          likesCount: 0,
          dislikesCount: 0
          // Pode adicionar outras propriedades iniciais da notícia aqui, se necessário
        });
  
        // Agora, adiciona o comentário para essa notícia
        const commentsCollection = collection(noticiaDocRef, 'comments');
        await addDoc(commentsCollection, {
          comment,
          userName: usuarioLogado.nome,
          createdAt: serverTimestamp(),
          likesCount: 0,
          dislikesCount: 0
        });
      } else {
        // Se a notícia já existir, apenas adiciona o comentário à subcoleção de "comments"
        const commentsCollection = collection(noticiaDocRef, 'comments');
        await addDoc(commentsCollection, {
          comment,
          userName: usuarioLogado.nome,
          createdAt: serverTimestamp(),
          likesCount: 0,
          dislikesCount: 0
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw new Error('Não foi possível adicionar o comentário.');
    }
  }

  async addLikeOrDislike(noticiaId: string, likeType: 'like' | 'dislike') {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) {
      throw new Error('Usuário não está autenticado.');
    }
  
    const noticiaDocRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}`);
    const userVoteRef = doc(this.firestore, `${this.noticiasCollection}/${noticiaId}/votes/${usuarioLogado.email}`);
  
    try {
      const noticiaSnapshot = await getDoc(noticiaDocRef);
      const userVoteSnapshot = await getDoc(userVoteRef);
  
      // Garantir que o documento da notícia exista
      if (!noticiaSnapshot.exists()) {
        await setDoc(noticiaDocRef, {
          id: noticiaId,
          likesCount: 0,
          dislikesCount: 0,
        });
      }
  
      // Obter os dados da notícia
      const noticiaData = noticiaSnapshot.data() || {};
      const likesCount = noticiaData['likesCount'] || 0;
      const dislikesCount = noticiaData['dislikesCount'] || 0;
  
      // Obter o voto anterior do usuário
      const previousVote = userVoteSnapshot.data()?.['vote'];
  
      if (!previousVote) {
        // Usuário ainda não votou
        await setDoc(userVoteRef, { vote: likeType });
  
        if (likeType === 'like') {
          await updateDoc(noticiaDocRef, { likesCount: likesCount + 1 });
        } else if (likeType === 'dislike') {
          await updateDoc(noticiaDocRef, { dislikesCount: dislikesCount + 1 });
        }
      } else if (previousVote === likeType) {
        // Remover o voto existente
        await deleteDoc(userVoteRef);
  
        if (likeType === 'like' && likesCount > 0) {
          await updateDoc(noticiaDocRef, { likesCount: likesCount - 1 });
        } else if (likeType === 'dislike' && dislikesCount > 0) {
          await updateDoc(noticiaDocRef, { dislikesCount: dislikesCount - 1 });
        }
      } else {
        // Alterar o voto
        await setDoc(userVoteRef, { vote: likeType });
  
        if (previousVote === 'like') {
          await updateDoc(noticiaDocRef, {
            likesCount: likesCount > 0 ? likesCount - 1 : 0,
            dislikesCount: dislikesCount + 1,
          });
        } else if (previousVote === 'dislike') {
          await updateDoc(noticiaDocRef, {
            dislikesCount: dislikesCount > 0 ? dislikesCount - 1 : 0,
            likesCount: likesCount + 1,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar os votos:', error);
      throw new Error('Não foi possível atualizar os votos.');
    }
  }

  getNoticiaById(noticiaId: string): Observable<any> {
    const noticiaDoc = doc(this.firestore, `noticias/${noticiaId}`);
    return docData(noticiaDoc, { idField: 'id' }); // Retorna um Observable que se atualiza com as mudanças no Firestore
  }

  getComments(noticiaId: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, `${this.noticiasCollection}/${noticiaId}/comments`);
    const commentsQuery = query(collectionRef, orderBy('createdAt', 'desc')); 
    return collectionData(commentsQuery, { idField: 'id' }) as Observable<any[]>;
  }


  async addLikeOrDislikeToComment(
    noticiaId: string,
    commentId: string,
    likeType: 'like' | 'dislike'
  ) {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) {
      throw new Error('Usuário não está autenticado.');
    }
  
    // Referências dos documentos e coleções
    const commentDocRef = doc(
      this.firestore,
      `${this.noticiasCollection}/${noticiaId}/comments/${commentId}`
    );
    const userVoteRef = doc(
      this.firestore,
      `${this.noticiasCollection}/${noticiaId}/comments/${commentId}/votes/${usuarioLogado.email}`
    );
  
    try {
      // Obter o documento do comentário e do voto do usuário
      const commentSnapshot = await getDoc(commentDocRef);
      const userVoteSnapshot = await getDoc(userVoteRef);
  
      // Garantir que o comentário existe
      if (!commentSnapshot.exists()) {
        throw new Error('Comentário não encontrado.');
      }
  
      // Obter os dados do comentário
      const commentData = commentSnapshot.data() || {};
      const likesCount = commentData['likesCount'] || 0;
      const dislikesCount = commentData['dislikesCount'] || 0;
  
      // Obter o voto anterior do usuário
      const previousVote = userVoteSnapshot.data()?.['vote'];
  
      if (!previousVote) {
        // Usuário ainda não votou
        await setDoc(userVoteRef, { vote: likeType });
  
        if (likeType === 'like') {
          await updateDoc(commentDocRef, { likesCount: likesCount + 1 });
        } else if (likeType === 'dislike') {
          await updateDoc(commentDocRef, { dislikesCount: dislikesCount + 1 });
        }
      } else if (previousVote === likeType) {
        // Remover o voto existente
        await deleteDoc(userVoteRef);
  
        if (likeType === 'like' && likesCount > 0) {
          await updateDoc(commentDocRef, { likesCount: likesCount - 1 });
        } else if (likeType === 'dislike' && dislikesCount > 0) {
          await updateDoc(commentDocRef, { dislikesCount: dislikesCount - 1 });
        }
      } else {
        // Alterar o voto
        await setDoc(userVoteRef, { vote: likeType });
  
        if (previousVote === 'like') {
          await updateDoc(commentDocRef, {
            likesCount: likesCount > 0 ? likesCount - 1 : 0,
            dislikesCount: dislikesCount + 1,
          });
        } else if (previousVote === 'dislike') {
          await updateDoc(commentDocRef, {
            dislikesCount: dislikesCount > 0 ? dislikesCount - 1 : 0,
            likesCount: likesCount + 1,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar os votos do comentário:', error);
      throw new Error('Não foi possível atualizar os votos do comentário.');
    }
  }

  async deleteComment(noticiaId: string, commentId: string): Promise<void> {
    try {
      const commentDocRef = doc(this.firestore, `noticias/${noticiaId}/comments/${commentId}`);
      await deleteDoc(commentDocRef);
      console.log('Comentário deletado com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      throw new Error('Não foi possível deletar o comentário.');
    }
  }
}
