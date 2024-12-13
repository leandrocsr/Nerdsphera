import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteracoesService } from '../servicos/interacoes.service';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../servicos/auth.service';

@Component({
  selector: 'app-noticia-detalhes',
  templateUrl: './noticia-detalhes.page.html',
  styleUrls: ['./noticia-detalhes.page.scss'],
})
export class NoticiaDetalhesPage implements OnInit {
  comments$: Observable<any[]> | null = null;
  newComment: string = ''; // Novo comentário
  loading: boolean = true; // Estado de carregamento
  error: string | null = null; // Mensagem de erro, se houver
  noticiaId: string = '';

  likes: number = 0;
  dislikes: number = 0;
  userVote: 'like' | 'dislike' | null = null; // Para rastrear o voto do usuário

  detalhes: any = {};

  private toast: string = '';

  constructor(
    private route: ActivatedRoute,
    private interacoesService: InteracoesService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private autenticacaoService: AutenticacaoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Recuperar os dados do estado
    this.detalhes = history.state.data;
    this.noticiaId = this.detalhes.id;

    if (!this.detalhes) {
      // Caso os dados não estejam disponíveis, você pode redirecionar ou exibir uma mensagem de erro
      console.error('Nenhum dado foi encontrado!');
    }
    this.loadComments();
    this.updateLikesAndDislikes();
  }

  async submitComment() {
    if (!this.newComment.trim()) {
      this.error = 'O comentário não pode estar vazio.';
      return;
    }

    try {
      // Envia o comentário utilizando o InteracoesService
      await this.interacoesService.addComment(this.noticiaId!, this.newComment);

      // Atualiza a lista de comentários
      this.loadComments();

      // Limpa o campo de comentário
      this.newComment = '';
    } catch (error) {
      this.error = 'Erro ao enviar o comentário. Tente novamente.';
      console.error(error);
    }
  }

  async loadComments() {
    if (!this.noticiaId) return;
  
    try {
      this.comments$ = await this.interacoesService.getComments(this.noticiaId);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  }

  likeNews() {
  this.interacoesService.addLikeOrDislike(this.noticiaId, 'like')
    .then(() => {
      console.log('Voto de like registrado com sucesso.');
      this.updateLikesAndDislikes(); // Atualiza os likes e dislikes
    })
    .catch(error => {
      console.error('Erro ao registrar o like:', error);
    });
}

dislikeNews() {
  this.interacoesService.addLikeOrDislike(this.noticiaId, 'dislike')
    .then(() => {
      console.log('Voto de dislike registrado com sucesso.');
      this.updateLikesAndDislikes(); // Atualiza os likes e dislikes
    })
    .catch(error => {
      console.error('Erro ao registrar o dislike:', error);
    });
}

  async updateLikesAndDislikes() {
    this.interacoesService.getNoticiaById(this.noticiaId);
      /* (noticia) => {
        if (noticia) {
          this.likes = noticia.likes || 0;
          this.dislikes = noticia.dislikes || 0;
          this.cdr.detectChanges(); // Força a atualização do template
        }
      },
      (error) => {
        console.error('Erro ao atualizar likes e dislikes:', error);
      }
    ); */
  }

  likeComment(commentId: string) {
    this.interacoesService.addLikeOrDislikeToComment(this.noticiaId, commentId, 'like')
      .then(() => console.log('Like adicionado ao comentário.'))
      .catch(error => console.error('Erro ao dar like no comentário:', error));
  }
  
  dislikeComment(commentId: string) {
    this.interacoesService.addLikeOrDislikeToComment(this.noticiaId, commentId, 'dislike')
      .then(() => console.log('Dislike adicionado ao comentário.'))
      .catch(error => console.error('Erro ao dar dislike no comentário:', error));
  }


  async refreshComments() {
    this.comments$ = this.interacoesService.getComments(this.noticiaId); // Atualiza o observable de comentários
  }
  
  async deleteComment(noticiaId: string, comment: any): Promise<void> {
    if (comment.authorUid !== this.currentUserUid) {
      this.toast = 'Você não tem permissão para deletar este comentário.';
      this.exibeToast();
      return;
    }
  
    try {
      await this.interacoesService.deleteComment(noticiaId, comment.id);
      this.toast = 'Comentário excluido.';
      this.exibeToast();
      // Atualize a lista de comentários após a exclusão
      this.loadComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      this.toast = 'Erro ao deletar o comentário. Tente novamente.';
      this.exibeToast();
    }
  }

  get currentUserUid(): string | null {
    const user = this.autenticacaoService.getUsuarioLogado();
    return user ? user.uId : null;
  }

  goBack() {
    this.navCtrl.back(); // Retorna para a página anterior
  }

  async exibeToast() {
    const toast = await this.toastController.create({
      message: this.toast,
      duration: 2000,
    });
    toast.present();
  }
}