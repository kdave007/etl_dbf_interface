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
    ['xalap', { name: 'Xalapa', apiUrl: 'http://192.168.10.43:3001' }],
    ['chetu', { name: 'chetumal', apiUrl: 'http://192.168.10.43:3001' }],
    ['penla', { name: 'peninsula', apiUrl: 'http://192.168.10.43:3001' }],
    ['manza', { name: 'manzanillo', apiUrl: 'http://192.168.10.43:3001' }],
    ['reyes', { name: 'reyes', apiUrl: 'http://192.168.10.43:3001' }],
    ['valla', { name: 'vallarta', apiUrl: 'http://192.168.10.43:3001' }],
    ['guada', { name: 'Guadalajara', apiUrl: 'http://192.168.10.43:3001' }]
    // ['Hermosillo', { name: 'Hermosillo', apiUrl: 'http://hermosillo-server.example.com/api' }]
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
