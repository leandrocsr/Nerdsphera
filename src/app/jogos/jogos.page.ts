import { Component, OnInit } from '@angular/core';
import { OpenCriticService } from '../servicos/openCritics/open-critic.service';

@Component({
  selector: 'app-jogos',
  templateUrl: './jogos.page.html',
  styleUrls: ['./jogos.page.scss'],
})
export class JogosPage implements OnInit {
  games: any[] = [];

  constructor(private openCriticService: OpenCriticService) {}

  ngOnInit() {
    this.loadGames();
  }

  async loadGames() {
    try {
      const data = await this.openCriticService.getLatestGames();

      // Processa os dados retornados da API e trata valores opcionais
      this.games = data.map((game: any) => ({
        id: game.id,
        name: game.name || 'Nome não disponível',
        releaseDate: game.firstReleaseDate
          ? new Date(game.firstReleaseDate).toLocaleDateString()
          : 'Data não disponível',
        platforms: game.platforms?.join(', ') || 'Plataformas não disponíveis',
        tags: game.tags?.join(', ') || 'Sem tags',
        image: game.image || 'https://ionicframework.com/docs/img/demos/card-media.png', // Imagem default caso não exista
        score: game.topCriticScore >= 0 ? game.topCriticScore : 'Sem pontuação',
        numReviews: game.numReviews || 'Sem análises',
        url: game.url || '#',
      }));
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      alert('Não foi possível carregar os jogos. Tente novamente mais tarde.');
    }
  }
}
