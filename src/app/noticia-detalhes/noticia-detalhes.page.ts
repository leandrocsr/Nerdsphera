import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteracoesService } from '../servicos/interacoes.service';
import { NavController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

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
  idNoticia: string | null = null;

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
    // Obtém o ID da notícia da rota
    this.idNoticia = this.route.snapshot.paramMap.get('id');

    if (this.idNoticia) {
      this.loadNoticiaDetalhes(this.idNoticia);
    } else {
      this.error = 'ID da notícia não fornecido.';
    }
  }

  // Carregar detalhes da notícia e sincronizar a avaliação
  loadNoticiaDetalhes(id: string) {
    this.interacoes.getNoticiaById(id).subscribe(
      (noticia) => {
        if (noticia) {
          this.noticia = noticia;
          this.likes = noticia.likes || 0;
          this.dislikes = noticia.dislikes || 0;
          this.loadComments(id);
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
        this.comments = comments || [];
      },
      (err) => {
        console.error('Erro ao carregar comentários:', err);
        this.error = 'Erro ao carregar comentários.';
      }
    );
  }

  // Adicionar um novo comentário
  submitComment() {
    if (this.newComment.trim() && this.noticia) {
      const comment = {
        text: this.newComment.trim(),
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        /* userId: this.interacoes.getUserId(), // Adicionar ID do usuário */
      };

      this.interacoes.addComment(this.noticia.id, comment).then((docRef) => {
        this.comments.push({ id: docRef.id, ...comment });
        this.newComment = '';
        this.cdr.detectChanges();
      });
    }
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
    this.updateNewsVotes();
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
    this.updateNewsVotes();
  }

  likeComment(comment: string) {

  }

  dislikeComment(comment: string) {
    
  }

  // Atualizar votos da notícia no Firestore
  updateNewsVotes() {
    if (this.noticia) {
      this.interacoes.updateNewsLikesDislikes(this.noticia.id, {
        likes: this.likes,
        dislikes: this.dislikes,
      });
    }
  }

  // Excluir comentário
  deleteComment(comment: any) {
    if (this.noticia && comment.id) {
      this.interacoes.deleteComment(this.noticia.id, comment.id).then(() => {
        this.comments = this.comments.filter((c) => c.id !== comment.id);
      });
    }
  }

  goBack() {
    this.navCtrl.back(); // Retorna para a página anterior
  }
}

