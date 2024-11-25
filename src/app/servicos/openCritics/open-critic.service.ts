import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenCriticService {
  private apiUrl =
    'https://opencritic-api.p.rapidapi.com/game?platforms=ps4%2Cps5&sort=score&order=asc&skip=20';
  private headers = {
    'x-rapidapi-key': '495dc9547bmsh7f86326ee9db933p1886d9jsn2356630d1d67',
    'x-rapidapi-host': 'opencritic-api.p.rapidapi.com',
  };

  async getLatestGames() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: this.headers,
      });

      // Verifique o código de status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Processa apenas se a resposta for válida

      // Mapeia os dados para retornar um formato consistente
      return result.map((game: any) => ({
        id: game.id,
        name: game.name,
        firstReleaseDate: game.firstReleaseDate,
        url: game.url,
        image: this.getGameImage(game.images), // Lógica para selecionar a imagem correta
        platforms: game.Platforms?.map((platform: any) => platform.name) || [],
        tags: game.tags?.map((tag: any) => tag.name) || [],
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Função para verificar e selecionar a imagem correta
  private getGameImage(images: any): string {
    if (images?.banner?.sm) {
      return `https://img.opencritic.com/${images.banner.sm}`;
    } else if (images?.box?.sm) {
      return `https://img.opencritic.com/${images.box.sm}`;
    }
    return ''; // Retorna vazio se nenhuma imagem estiver disponível
  }
}
