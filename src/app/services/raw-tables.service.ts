import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlazaService } from './plaza.service';

export interface TableDataRequest {
  tableName: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  city?: string;
  searchText?: string;
  searchField?: string;
  paginationContext?: {
    page?: number;
    pageSize?: number;
  };
}

export interface ColumnMetadata {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  is_nullable: string;
  column_default: string | null;
}

export interface TableConfig {
  date: boolean;
  date_field: string;
}

export interface TableDataResponse {
  success: boolean;
  metadata: ColumnMetadata[];
  data: any[];
  tableConfig: TableConfig;
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RawTablesService {
  constructor(
    private http: HttpClient,
    private plazaService: PlazaService
  ) { }

  /**
   * Fetch table data from API with filters and pagination
   */
  getTableData(request: TableDataRequest, plaza: string): Observable<TableDataResponse> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    
    const hasDateFilter = request.dateRange && (request.dateRange.start || request.dateRange.end);
    const hasSearchFilter = request.searchText && request.searchField;
    const useFilteredEndpoint = hasDateFilter || hasSearchFilter;
    
    const endpoint = useFilteredEndpoint 
      ? `${apiUrl}/api/filtered_data`
      : `${apiUrl}/api/paginated_data`;

    const body: any = {
      tableName: request.tableName
    };

    if (hasDateFilter) {
      body.dateRange = {
        start: request.dateRange!.start || undefined,
        end: request.dateRange!.end || undefined
      };
    }

    if (request.city) {
      body.city = request.city;
    }

    if (hasSearchFilter) {
      body.searchText = request.searchText;
      body.searchField = request.searchField;
    }

    if (request.paginationContext) {
      body.paginationContext = {
        page: request.paginationContext.page || 1,
        pageSize: request.paginationContext.pageSize || 10
      };
    }

    return this.http.post<TableDataResponse>(endpoint, body);
  }

  /**
   * Get columns configuration for a specific table
   */
  getTableColumns(tableName: string, plaza: string): Observable<ColumnMetadata[]> {
    const apiUrl = this.plazaService.getApiUrl(plaza);
    const endpoint = `${apiUrl}/raw-tables/columns/${tableName}`;
    return this.http.get<ColumnMetadata[]>(endpoint);
  }
}
