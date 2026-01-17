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
    const endpoint = `${apiUrl}/api/clients_status`;

    return this.http.get<ClientStatusResponse>(endpoint);
  }

  /**
   * Update the shared client status data
   */
  updateClientStatus(data: ClientStatusResponse): void {
    this.clientStatusSubject.next(data);
  }
}
