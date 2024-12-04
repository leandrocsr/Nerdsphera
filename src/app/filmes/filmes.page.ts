import { Component, OnInit } from '@angular/core';
import { FilmesService } from '../servicos/movieDB/filmes.service';
import { NavController } from '@ionic/angular';
import { InteracoesService } from '../servicos/interacoes.service';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.page.html',
  styleUrls: ['./filmes.page.scss'],
})
export class FilmesPage implements OnInit {
  movies: any[] = []; // Armazena a lista de filmes
  genres: any[] = []; // Armazena a lista de gêneros

  constructor(
    private filmesService: FilmesService, 
    private navCtrl: NavController,
    private interacoesService: InteracoesService
  ) {}

  abrirDetalhes(item: any, type: string) {
    // Normalizar o formato do item para salvar no Firestore
    const noticiaPadronizada = this.interacoesService.normalizeData(item, type);
  
    this.interacoesService.saveNoticiaToFirestore(noticiaPadronizada)
      .then(() => {
        this.navCtrl.navigateForward(['tabs/noticia-detalhes', noticiaPadronizada.id]); // Navega para detalhes
      })
      .catch((error) => {
        console.error('Erro ao salvar a notícia no Firestore:', error);
      });
  }

  ngOnInit() {
    this.loadGenresAndMovies();
  }

  loadGenresAndMovies() {
    // Carregar os gêneros primeiro
    this.filmesService.getGenres().subscribe(
      (response: any) => {
        this.genres = response.genres || []; // Salva os gêneros
        this.loadMovies(); // Depois que os gêneros forem carregados, carrega os filmes
      },
      (error) => {
        console.error('Erro ao carregar gêneros:', error);
        alert('Não foi possível carregar os gêneros. Tente novamente mais tarde.');
      }
    );
  }

  loadMovies() {
    this.filmesService.getNowPlayingMovies().subscribe(
      (response: any) => {
        this.movies = response.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title || 'Título não disponível',
          overview: movie.overview || 'Descrição não disponível',
          genres: this.getGenresNames(movie.genre_ids), // Chama a função para mapear os gêneros
          releaseDate: movie.release_date
            ? new Date(movie.release_date).toLocaleDateString()
            : 'Data não disponível',
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'assets/default-image.png',
        }));
      },
      (error) => {
        console.error('Erro ao carregar filmes:', error);
        alert('Não foi possível carregar os filmes. Tente novamente mais tarde.');
      }
    );
  }

  getGenresNames(genreIds: number[]): string {
    const genreNames = genreIds
      .map((id) => {
        const genre = this.genres.find((g) => g.id === id); // Busca o nome do gênero pelo ID
        return genre ? genre.name : null;
      })
      .filter((name) => name)
      .join(', ');

    return genreNames || 'Sem gênero';
  }
}
