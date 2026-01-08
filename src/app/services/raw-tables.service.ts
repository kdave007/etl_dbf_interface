import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TableDataRequest {
  tableName: string;
  plaza: string;
  searchText?: string;
  searchField?: string;
  dateStart?: string;
  dateEnd?: string;
  startIndex: number;
  endIndex: number;
  pageSize: number;
  currentPage: number;
}

export interface TableDataResponse {
  data: any[];
  totalRecords: number;
  columns?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RawTablesService {
  private apiUrl = '/api/raw-tables'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  /**
   * Fetch table data from API with filters and pagination
   */
  getTableData(request: TableDataRequest): Observable<TableDataResponse> {
    // Send as POST with JSON body
    const body = {
      tableName: request.tableName,
      plaza: request.plaza,
      startIndex: request.startIndex,
      endIndex: request.endIndex,
      pageSize: request.pageSize,
      currentPage: request.currentPage,
      searchText: request.searchText || null,
      searchField: request.searchField || null,
      dateStart: request.dateStart || null,
      dateEnd: request.dateEnd || null
    };

    return this.http.post<TableDataResponse>(this.apiUrl, body);
  }

  /**
   * Get columns configuration for a specific table
   */
  getTableColumns(tableName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/columns/${tableName}`);
  }
}
