import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlazaService } from './plaza.service';
 
export interface SucursalConfigRequest {
  command: string;
  client_id: string;
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
      client_id: clientId
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
}