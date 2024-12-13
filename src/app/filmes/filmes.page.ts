import { Component, OnInit } from '@angular/core';
import { FilmesService } from '../servicos/movieDB/filmes.service';
import { NavController } from '@ionic/angular';
import { InteracoesService } from '../servicos/interacoes.service';
import { Router } from '@angular/router';


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
    private interacoesService: InteracoesService,
    private router: Router
  ) {}

  abrirDetalhes(movie: any) {
    const detalhes = {
      type: movie.type || 'Tipo não disponível',
      id: movie.id,
      name: movie.name || movie.title || 'Título não disponível',
      overview: movie.overview || 'Resumo não disponível',
      releaseDate: movie.releaseDate
        ? this.formatDate(movie.releaseDate)
        : 'Data não disponível',
      genre: this.getGenresNames(movie),
      image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'assets/default-image.png',
    };
  
    // Navegar para a página de detalhes e passar os dados
    this.router.navigate(['/tabs/noticia-detalhes/${detalhes.id}'], { state: { data: detalhes } });
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

  // Formatar a data no formato "dd/mm/aa"
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
