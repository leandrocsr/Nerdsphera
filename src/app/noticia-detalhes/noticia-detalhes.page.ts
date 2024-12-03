import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteracoesService } from '../servicos/interacoes.service';

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
    private interacoes: InteracoesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtém o ID da URL
    if (id) {
      this.interacoes.getNoticiaById(id).subscribe((noticia) => {
        this.noticia = noticia; // Carrega a notícia na variável local
      });
    } else {
      console.error('ID da notícia não encontrado na URL.');
      // Aqui você pode redirecionar ou exibir uma mensagem de erro, se necessário.
    }
  }

  // Carregar detalhes da notícia
  loadNoticiaDetalhes(id: string) {
    this.interacoes.getLatestNews().subscribe(
      (noticias) => {
        console.log('Respostas da API:', noticias);
        this.noticia = noticias.find((noticia) => noticia.id === Number(id));
        console.log('Notícia carregada:', this.noticia);
        if (this.noticia) {
          this.loadComments(this.noticia.id);
        } else {
          this.error = 'Detalhes da notícia não encontrados.';
          this.loading = false;
        }
      },
      (err) => {
        console.error('Erro ao carregar detalhes da notícia:', err);
        this.error = 'Erro ao carregar os detalhes. Tente novamente mais tarde.';
        this.loading = false;
      },
      () => {
        this.loading = false; // Finalizar carregamento após a requisição
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
        this.error = 'Erro ao carregar comentários. Tente novamente mais tarde.';
      }
    );
  }

  // Avaliar a notícia
  rateNoticia(newRating: number) {
    this.rating = newRating;
    this.interacoes.updateRating(this.noticia.id, this.rating).then(() => {
      console.log('Avaliação salva!', this.rating);
    });
  }

  // Adicionar novo comentário
  submitComment() {
    if (this.newComment.trim() && this.noticia) {
      const comment = {
        text: this.newComment,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      };
      this.interacoes.addComment(this.noticia.id, comment).then(() => {
        this.newComment = '';
        console.log('Comentário adicionado!');
        this.loadComments(this.noticia.id); // Atualizar lista de comentários
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
}
