import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private apiKey = '4bb00ef5247036f81c68894a67093724';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getNowPlayingMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&language=pt-BR&page=1`);
  }
  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`);
  }
}
