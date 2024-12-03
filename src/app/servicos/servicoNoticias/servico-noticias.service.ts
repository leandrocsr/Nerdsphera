import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilmesService } from '../movieDB/filmes.service';
import { SeriesService } from '../movieDB/series.service';
import { OpenCriticService } from '../openCritics/open-critic.service';

@Injectable({
  providedIn: 'root',
})
export class ServicoNoticiasService {
  constructor(
    private filmesService: FilmesService,
    private seriesService: SeriesService,
    private openCriticService: OpenCriticService
  ) {}

  getLatestNews() {
    return forkJoin({
      movies: this.filmesService.getNowPlayingMovies(),
      series: this.seriesService.getTrendingSeries(),
      games: this.openCriticService.getLatestGames(),
      genresFilmes: this.filmesService.getGenres(),
      genresSeries: this.seriesService.getGenres(),
    }).pipe(
      map((data: any) => {
        const combinedNews = [
          // Filmes
          ...data.movies.results.map((movie: any) => ({
            id: movie.id,
            type: 'Movie',
            name: movie.title,
            releaseDate: movie.release_date,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            genre_ids: movie.genre_ids || [],
          })),
          // Séries
          ...data.series.results.map((serie: any) => ({
            id: serie.id,
            type: 'Serie',
            name: serie.name,
            releaseDate: serie.first_air_date,
            image: serie.poster_path
              ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
              : null,
            genre_ids: serie.genre_ids || [],
          })),
          // Jogos
          ...data.games.map((game: any) => ({
            id: game.id || game.slug,
            type: 'Game',
            name: game.name,
            releaseDate: game.firstReleaseDate,
            image: game.image || null,
            genre: game.tags ? game.tags.join(', ') : 'Não disponível',
          })),
        ];

        // Ordenar por data
        return combinedNews.sort((a: any, b: any) => {
          const dateA = new Date(a.releaseDate).getTime();
          const dateB = new Date(b.releaseDate).getTime();
          return dateB - dateA; // Ordenar por data decrescente
        });
      })
    );
  }
}
