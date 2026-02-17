import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlazaService } from './plaza.service';

export interface ClientConnection {
  client_id: string;
  city: string;
  location: string;
  last_seen: string;
}

export interface ClientStatusResponse {
  success: boolean;
  data: ClientConnection[];
}

export interface ClientStatusRequest {
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientStatusService {
  private clientStatusSubject = new BehaviorSubject<ClientStatusResponse | null>(null);
  public clientStatus$ = this.clientStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private plazaService: PlazaService
  ) { }

  /**
   * Fetch client connections/status from API
   */
  getClientConnections(city: string): Observable<ClientStatusResponse> {
    const apiUrl = this.plazaService.getApiUrl(city);
    const endpoint = `${apiUrl}/api/clients_status_by_plaza`;

    const cityMap: Record<string, string> = {
      'xalap': 'XALAP',
      'chetu': 'CHETU',
      'penla': 'PENLA',
      'valla': 'VALLA',
      'manza': 'MANZA',
      'reyes': 'REYES'
    };

    const body: ClientStatusRequest = {
      city: cityMap[city] || city.toUpperCase()
    };

    return this.http.post<ClientStatusResponse>(endpoint, body);
  }

  /**
   * Update the shared client status data
   */
  updateClientStatus(data: ClientStatusResponse): void {
    this.clientStatusSubject.next(data);
  }
}
