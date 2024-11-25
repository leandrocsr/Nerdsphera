import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../servicos/movieDB/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {
  series: any[] = [];
  genres: any[] = [];

  constructor(private seriesService: SeriesService) {}

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
}
