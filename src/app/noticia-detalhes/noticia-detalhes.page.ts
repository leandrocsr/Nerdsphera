import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteracoesService } from '../servicos/interacoes.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-noticia-detalhes',
  templateUrl: './noticia-detalhes.page.html',
  styleUrls: ['./noticia-detalhes.page.scss'],
})
export class NoticiaDetalhesPage implements OnInit {
  noticia: any = null; // Detalhes da notícia
  comments: any[] = []; // Comentários da notícia
  newComment: string = ''; // Novo comentário
  rating: number = 0; // Avaliação da notícia
  loading: boolean = true; // Estado de carregamento
  error: string | null = null; // Mensagem de erro, se houver

  constructor(
    private route: ActivatedRoute,
    private interacoes: InteracoesService,
    private navCtrl: NavController
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

  // Carregar detalhes da notícia e comentários
  loadNoticiaDetalhes(id: string) {
    this.interacoes.getNoticiaById(id).subscribe(
      (noticia) => {
        this.noticia = noticia;
        if (this.noticia) {
          this.rating = this.noticia.rating || 0; // Carrega avaliação, se houver
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
        this.loading = false; // Finalizar carregamento
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

  // Avaliar a notícia
  rateNoticia(newRating: number) {
    if (!this.noticia) return;
    this.rating = newRating;
    this.interacoes.updateRating(this.noticia.id, this.rating).then(() => {
      console.log('Avaliação salva:', this.rating);
    });
  }

  // Adicionar novo comentário
  submitComment() {
    if (this.newComment.trim() && this.noticia) {
      const comment = {
        text: this.newComment.trim(),
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      };
      this.interacoes.addComment(this.noticia.id, comment).then(() => {
        this.newComment = ''; // Limpar campo de comentário
        this.comments.push(comment); // Adicionar comentário localmente
        console.log('Comentário adicionado:', comment);
      });
    }
  }

  // Curtir um comentário
  likeComment(comment: any) {
    if (!this.noticia) return;
    this.interacoes
      .updateCommentVotes(this.noticia.id, comment.id, (comment.likes || 0) + 1, comment.dislikes)
      .then(() => {
        comment.likes++;
      });
  }

  // Não curtir um comentário
  dislikeComment(comment: any) {
    if (!this.noticia) return;
    this.interacoes
      .updateCommentVotes(this.noticia.id, comment.id, comment.likes, (comment.dislikes || 0) + 1)
      .then(() => {
        comment.dislikes++;
      });
  }

  goBack() {
    this.navCtrl.back(); // Retorna para a página anterior
  }
}
