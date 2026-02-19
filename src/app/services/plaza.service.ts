import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PlazaConfig {
  name: string;
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlazaService {
  private plazaConfigs: Map<string, PlazaConfig> = new Map([
    ['xalap', { name: 'Xalapa', apiUrl: environment.apiUrl }],
    ['chetu', { name: 'chetumal', apiUrl: environment.apiUrl }],
    ['penla', { name: 'peninsula', apiUrl: environment.apiUrl }],
    ['manza', { name: 'manzanillo', apiUrl: environment.apiUrl }],
    ['reyes', { name: 'reyes', apiUrl: environment.apiUrl }],
    ['valla', { name: 'vallarta', apiUrl: environment.apiUrl }],
    ['guada', { name: 'Guadalajara', apiUrl: environment.apiUrl }]
    // Future: Add different API URLs per plaza if needed
    // ['hermosillo', { name: 'Hermosillo', apiUrl: 'http://hermosillo-server.example.com' }]
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
