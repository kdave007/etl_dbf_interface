import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlazaService } from './plaza.service';
 
export interface SucursalConfigRequest {
  command: string;
  client_ids: string[];
}

export interface SucursalConfigItem {
  key: string;
  value: string;
}

export interface SucursalConfigResponse {
  success: boolean;
  client_id: string;
  data: SucursalConfigItem[];
  totalRecords: number;
}

export interface SucursalListRequest {
  city: string;
}

export interface Sucursal {
  client_id: string;
  tienda: string;
  tipo: string;
}

export interface SucursalListResponse {
  success: boolean;
  plaza: string;
  data: Sucursal[];
}

export interface BulkUpdateRequest {
  client_ids: string[];
  config: Record<string, any>;
}

export interface BulkUpdateResponse {
  success: boolean;
  updated: number;
  failed: number;
  errors?: string[];
}

export interface UpdateConfigRequest {
  command: string;
  client_ids: string[];
  settings: SucursalConfigItem[];
}

export interface UpdateConfigResponse {
  success: boolean;
  client_id: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SucursalConfigService {
  constructor(
    private http: HttpClient,
    private plazaService: PlazaService
  ) { }

  /**
   * Fetch sucursal configuration data from API
   */
  getSucursalConfig(clientId: string, plaza: string): Observable<SucursalConfigResponse> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    const endpoint = `${apiUrl}/api/client_settings`;

    const body: SucursalConfigRequest = {
      command: 'get',
      client_ids: [clientId]
    };

    return this.http.post<SucursalConfigResponse>(endpoint, body);
  }

  /**
   * Parse configuration data array into a key-value object
   */
  parseConfigToObject(data: SucursalConfigItem[]): Record<string, string> {
    return data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Get a specific configuration value by key
   */
  getConfigValue(data: SucursalConfigItem[], key: string): string | undefined {
    const item = data.find(item => item.key === key);
    return item?.value;
  }

  /**
   * Fetch all sucursales for a given city/plaza
   */
  getSucursalesByCity(city: string, plaza: string): Observable<SucursalListResponse> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    const endpoint = `${apiUrl}/api/clients_by_plaza`;

    const body: SucursalListRequest = {
      city: city
    };

    return this.http.post<SucursalListResponse>(endpoint, body);
  }

  /**
   * Update configuration for multiple sucursales
   * Note: DB_NAME should be excluded from config before calling this method
   */
  updateMultipleSucursales(clientIds: string[], config: any, plaza: string): Observable<BulkUpdateResponse> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    const endpoint = `${apiUrl}/api/client_settings`;

    const configArray = Object.entries(config).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? (value ? '1' : '0') : String(value)
    }));

    const body: UpdateConfigRequest = {
      command: 'bulk_update',
      client_ids: clientIds,
      settings: configArray
    };

    return this.http.post<BulkUpdateResponse>(endpoint, body);
  }

  /**
   * Update configuration for a single sucursal
   * Use this for the "GUARDAR CONFIGURACIÓN" button
   */
  updateSucursalConfig(clientId: string, config: any, plaza: string): Observable<UpdateConfigResponse> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    const endpoint = `${apiUrl}/api/client_settings`;

    const configArray = Object.entries(config).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? (value ? '1' : '0') : String(value)
    }));

    const body: UpdateConfigRequest = {
      command: 'update',
      client_ids: [clientId],
      settings: configArray
    };

    return this.http.post<UpdateConfigResponse>(endpoint, body);
  }
}