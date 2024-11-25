import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  private apiKey = '4bb00ef5247036f81c68894a67093724'; // Sua chave da API
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // Método para buscar as séries mais populares ou trending
  getTrendingSeries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/tv/week?api_key=${this.apiKey}&language=pt-BR`);
  }

  // Método para buscar a lista de gêneros (categorias) disponíveis
  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}&language=pt-BR`);
  }
}
