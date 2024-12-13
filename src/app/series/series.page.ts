import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../servicos/movieDB/series.service';
import { NavController } from '@ionic/angular';
import { InteracoesService } from '../servicos/interacoes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {
  series: any[] = [];
  genres: any[] = [];

  constructor(
    private seriesService: SeriesService, 
    private navCtrl: NavController,
    private interacoesService: InteracoesService,
    private router: Router
  ) {}

  abrirDetalhes(serie: any) {
    const detalhes = {
      type: serie.type || 'Tipo não disponível',
      id: serie.id,
      name: serie.name || serie.title || 'Título não disponível',
      overview: serie.overview || 'Resumo não disponível',
      releaseDate: serie.releaseDate
        ? this.formatDate(serie.releaseDate)
        : 'Data não disponível',
      genre: this.getGenresNames(serie),
      image: serie.poster_path
        ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
        : 'assets/default-image.jpg',
      url: `https://www.themoviedb.org/tv/${serie.id}`,
    };
  
    // Navegar para a página de detalhes e passar os dados
    this.router.navigate(['/tabs/noticia-detalhes/${detalhes.id}'], { state: { data: detalhes } });
  }

  ngOnInit() {
    this.loadGenres();
    this.loadTrendingSeries();
  }

  // Carregar gêneros
  loadGenres() {
    this.seriesService.getGenres().subscribe(
      (data) => {
        this.genres = data['genres']; // Guardar os gêneros na variável 'genres'
      },
      (error) => {
        console.error('Erro ao carregar gêneros:', error);
      }
    );
  }

  // Carregar séries em tendência
  loadTrendingSeries() {
    this.seriesService.getTrendingSeries().subscribe(
      (data) => {
        // Mapear as séries e associar os gêneros pelo ID
        this.series = data['results'].map((serie: any) => ({
          id: serie.id,
          name: serie.name || 'Nome não disponível',
          releaseDate: new Date(serie.first_air_date).toLocaleDateString(),
          overview: serie.overview || 'Descrição não disponível',
          genres: this.getGenresNames(serie.genre_ids),
          image: serie.poster_path
            ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
            : 'assets/default-image.jpg',
          url: `https://www.themoviedb.org/tv/${serie.id}`,
        }));
      },
      (error) => {
        console.error('Erro ao carregar séries:', error);
      }
    );
  }

  // Função para mapear os IDs dos gêneros para os nomes
  getGenresNames(genreIds: number[]): string {
    const genreNames = genreIds
      .map((id) => {
        const genre = this.genres.find((g) => g.id === id);
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
