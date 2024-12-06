import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteracoesService } from '../servicos/interacoes.service';
import { NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core'; // Importação para força de detecção

@Component({
  selector: 'app-noticia-detalhes',
  templateUrl: './noticia-detalhes.page.html',
  styleUrls: ['./noticia-detalhes.page.scss'],
})
export class NoticiaDetalhesPage implements OnInit {
  noticia: any = null; // Detalhes da notícia
  comments: any[] = []; // Comentários da notícia
  newComment: string = ''; // Novo comentário
  loading: boolean = true; // Estado de carregamento
  error: string | null = null; // Mensagem de erro, se houver

  likes: number = 0;
  dislikes: number = 0;
  userVote: 'like' | 'dislike' | null = null; // Para rastrear o voto do usuário

  constructor(
    private route: ActivatedRoute,
    private interacoes: InteracoesService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtém o ID da URL
    if (id) {
      this.loadNoticiaDetalhes(id); // Carregar detalhes da notícia e comentários
    } else {
      this.error = 'ID da notícia não encontrado.';
      this.loading = false;
    }
  }

  // Carregar detalhes da notícia e sincronizar a avaliação
  loadNoticiaDetalhes(id: string) {
    this.interacoes.getNoticiaById(id).subscribe(
      (noticia) => {
        this.noticia = noticia;
        if (this.noticia) {
          this.likes = this.noticia.likesCount || 0; // Use likesCount
          this.dislikes = this.noticia.dislikesCount || 0; // Use dislikesCount
          this.loadComments(this.noticia.id);
        } else {
          this.error = 'Notícia não encontrada.';
        }
      },
      (err) => {
        console.error('Erro ao carregar a notícia:', err);
        this.error = 'Erro ao carregar detalhes da notícia.';
      },
      () => {
        this.loading = false;
      }
    );
  }

  // Carregar comentários da notícia
  loadComments(noticiaId: string) {
    this.interacoes.getComments(noticiaId).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (err) => {
        console.error('Erro ao carregar comentários:', err);
        this.error = 'Erro ao carregar comentários.';
      }
    );
  }

  // Votar na notícia (Gostei! / Não gostei!)
  likeNews() {
    if (this.userVote === 'like') {
      this.likes--;
      this.userVote = null;
    } else {
      if (this.userVote === 'dislike') {
        this.dislikes--;
      }
      this.likes++;
      this.userVote = 'like';
    }
    this.updateNewsVotes(); // Atualiza os votos da notícia
  }
  
  dislikeNews() {
    if (this.userVote === 'dislike') {
      this.dislikes--;
      this.userVote = null;
    } else {
      if (this.userVote === 'like') {
        this.likes--;
      }
      this.dislikes++;
      this.userVote = 'dislike';
    }
    this.updateNewsVotes(); // Atualiza os votos da notícia
  }

  // Atualizar votos da notícia no Firestore
  updateNewsVotes() {
    if (this.noticia) {
      const voteData = {
        likes: this.userVote === 'like' ? 1 : this.userVote === 'dislike' ? -1 : 0,
        dislikes: this.userVote === 'dislike' ? 1 : this.userVote === 'like' ? -1 : 0,
      };
      this.interacoes.updateNewsLikesDislikes(this.noticia.id, voteData)
        .catch((err) => console.error('Erro ao atualizar votos da notícia:', err));
    }
  }

  // Votar em um comentário (Gostei! / Não gostei!)
  likeComment(comment: any) {
    if (comment.userVote === 'like') {
      comment.likes--;
      comment.userVote = null; // Remove o voto
    } else {
      if (comment.userVote === 'dislike') {
        comment.dislikes--; // Reverter o dislike
      }
      comment.likes++;
      comment.userVote = 'like'; // Marca como curtido
    }
    this.interacoes.updateCommentLikesDislikes(this.noticia.id, comment.id, comment.userVote === 'like')
    .then(() => this.cdr.detectChanges()) // Confirma a atualização e força a renderização
    .catch((err) => console.error('Erro ao atualizar votos do comentário:', err));
    this.cdr.detectChanges();
  }
  
  // Não curtir um comentário (Gostei! / Não gostei!)
  dislikeComment(comment: any) {
    if (comment.userVote === 'dislike') {
      comment.dislikes--;
      comment.userVote = null; // Remove o voto
    } else {
      if (comment.userVote === 'like') {
        comment.likes--; // Reverter o like
      }
      comment.dislikes++;
      comment.userVote = 'dislike'; // Marca como não curtido
    }
    this.interacoes.updateCommentLikesDislikes(this.noticia.id, comment.id, comment.userVote === 'like')
    .then(() => this.cdr.detectChanges()) // Confirma a atualização e força a renderização
    .catch((err) => console.error('Erro ao atualizar votos do comentário:', err));
    this.cdr.detectChanges();
  }

  // Atualizar os votos de um comentário no Firestore
  updateCommentLikesDislikes(comment: any) {
    if (this.noticia && comment.id) {
      this.interacoes.updateCommentLikesDislikes(this.noticia.id, comment.id, comment.likes)
        .catch((err) => console.error('Erro ao atualizar votos do comentário:', err));
    }
  }

  submitComment() {
    if (this.newComment.trim() && this.noticia) {
      const comment = {
        text: this.newComment.trim(),
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      };
      this.interacoes.addComment(this.noticia.id, comment)
        .then((docRef) => {
          this.comments.push({ id: docRef.id, ...comment }); // Adiciona o ID do Firestore ao comentário
          this.newComment = ''; // Limpar campo de comentário
          this.cdr.detectChanges(); // Atualiza a interface
          console.log('Comentário adicionado:', comment);
        })
        .catch((err) => console.error('Erro ao adicionar comentário:', err));
    }
    this.cdr.detectChanges();
  }
  // Excluir comentário
  deleteComment(comment: any) {
    if (!this.noticia) return;
    this.interacoes.deleteComment(this.noticia.id, comment.id).then(() => {
      this.comments = this.comments.filter((c) => c.id !== comment.id); // Remove localmente
      console.log('Comentário excluído:', comment.id);
    });
  }

  goBack() {
    this.navCtrl.back(); // Retorna para a página anterior
  }
}
