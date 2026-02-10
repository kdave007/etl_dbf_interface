import { Injectable } from '@angular/core';

export interface PlazaConfig {
  name: string;
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlazaService {
  private plazaConfigs: Map<string, PlazaConfig> = new Map([
    ['xalap', { name: 'Xalapa', apiUrl: 'http://localhost:3001' }],
    ['chetu', { name: 'chetumal', apiUrl: 'http://localhost:3001' }],
    ['penla', { name: 'peninsula', apiUrl: 'http://localhost:3001' }],
    ['Guadalajara', { name: 'Guadalajara', apiUrl: 'http://guadalajara-server.example.com/api' }],
    ['Hermosillo', { name: 'Hermosillo', apiUrl: 'http://hermosillo-server.example.com/api' }]
  ]);

  constructor() { }

  getApiUrl(plaza: string): string {
    const config = this.plazaConfigs.get(plaza);
    if (!config) {
      throw new Error(`No API configuration found for plaza: ${plaza}`);
    }
    return config.apiUrl;
  }

  getPlazaConfig(plaza: string): PlazaConfig | undefined {
    return this.plazaConfigs.get(plaza);
  }

  getAllPlazas(): PlazaConfig[] {
    return Array.from(this.plazaConfigs.values());
  }

  addPlaza(plaza: string, apiUrl: string): void {
    this.plazaConfigs.set(plaza, { name: plaza, apiUrl });
  }

  removePlaza(plaza: string): boolean {
    return this.plazaConfigs.delete(plaza);
  }
}
