import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ServicoNoticiasService } from '../servicos/servicoNoticias/servico-noticias.service';
import { FilmesService } from '../servicos/movieDB/filmes.service';
import { SeriesService } from '../servicos/movieDB/series.service';
import { NavController } from '@ionic/angular';
import { InteracoesService } from '../servicos/interacoes.service';


@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  noticias: any[] = [];
  private readonly movieDbImageBaseUrl = 'https://image.tmdb.org/t/p/w500'; // Base URL para imagens da API The Movie DB
  genresFilmes: any[] = [];
  genresSeries: any[] = [];

  constructor(
    private servicoNoticias: ServicoNoticiasService,
    private filmesService: FilmesService,
    private seriesService: SeriesService,
    private navCtrl: NavController,
    private interacoesService: InteracoesService
  ) {}

  abrirDetalhes(noticia: any) {
    this.interacoesService.saveNoticiaToFirestore(noticia)
    .then(() => {
      this.navCtrl.navigateForward(['tabs/noticia-detalhes', noticia.id]); // Navega para a página de detalhes
    })
    .catch((error) => {
      console.error('Erro ao salvar a notícia no Firestore:', error);
    });
  }

  /* openNoticiaDetalhes(noticia: any) {
    console.log('Notícia selecionada:', noticia);
    this.navCtrl.navigateForward(['tabs/noticia-detalhes', noticia.id]);
  } */

  ngOnInit() {
    this.loadGenresAndNoticias();
  }

  // Carregar os gêneros e notícias
  loadGenresAndNoticias() {
    forkJoin({
      genresFilmes: this.filmesService.getGenres(),
      genresSeries: this.seriesService.getGenres(),
      noticias: this.servicoNoticias.getLatestNews()
    }).subscribe({
      next: (data: any) => {
        this.genresFilmes = data.genresFilmes.genres || [];
        this.genresSeries = data.genresSeries.genres || [];
        this.noticias = data.noticias.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || 'Título não disponível',
          releaseDate: item.releaseDate
            ? this.formatDate(item.releaseDate)
            : 'Data não disponível',
          type: item.type || 'Tipo não disponível',
          genre: this.getGenreNames(item),
          image: this.getImageUrl(item),
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar as notícias:', error);
        alert('Não foi possível carregar as notícias. Tente novamente mais tarde.');
      }
    });
  }

  // Obter os nomes dos gêneros
  getGenreNames(item: any): string {
    if (item.type === 'Movie') {
      return this.getGenresNames(item.genre_ids, this.genresFilmes);
    } else if (item.type === 'Serie') {
      return this.getGenresNames(item.genre_ids, this.genresSeries);
    }
    return 'Gênero não disponível';
  }

  // Mapear os gêneros para os nomes
  getGenresNames(genreIds: number[], genres: any[]): string {
    const genreNames = genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((name) => name)
      .join(', ');

    return genreNames || 'Sem gênero';
  }

  // Obter a URL da imagem
  private getImageUrl(item: any): string {
    if (item.type === 'Movie' || item.type === 'Serie') {
      return item.image || 'assets/default-image.png';
    } else if (item.type === 'Game') {
      return item.image || 'assets/default-image.png';
    }
    return 'assets/default-image.png';
  }

  // Formatar a data no formato "dd/mm/aa"
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
  
}
