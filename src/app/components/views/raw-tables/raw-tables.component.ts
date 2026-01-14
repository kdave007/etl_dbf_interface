import { Component, OnInit } from '@angular/core';
import { TablePaginationComponent } from '../../shared/table-pagination/table-pagination.component';
import { AdvancedFilterComponent, FilterConfig, FilterValues } from '../../shared/advanced-filter/advanced-filter.component';
import { DynamicTableComponent, TableColumn, TableOption } from '../../shared/dynamic-table/dynamic-table.component';
import { PlazaSelectorComponent } from '../../shared/plaza-selector/plaza-selector.component';
import { RawTablesService, TableDataRequest } from '../../../services/raw-tables.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';

@Component({
  selector: 'app-raw-tables',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbIconModule, NbEvaIconsModule, NbInputModule, NbButtonModule, NbSpinnerModule, FormsModule, TablePaginationComponent, AdvancedFilterComponent, DynamicTableComponent, PlazaSelectorComponent],
  templateUrl: './raw-tables.component.html',
  styleUrl: './raw-tables.component.scss',
})
export class RawTablesComponent implements OnInit {
  selectedPlaza: string = 'xalap';
  selectedTable: string = 'VENTA';
  isLoading: boolean = false;
  currentFilters: FilterValues | null = null;
  currentDateField: string = 'FECHA';

  constructor(private rawTablesService: RawTablesService) {}

  tableOptions: TableOption[] = [
    { value: 'CANOTA', label: 'CANOTA' },
    { value: 'CUNOTA', label: 'CUNOTA' },
    { value: 'VENTA', label: 'VENTA' },
    { value: 'PARTVTA', label: 'PARTVTA' },
    { value: 'COBRANZA', label: 'COBRANZA' },
    { value: 'XCORTE', label: 'XCORTE' },
    { value: 'CLIENTE', label: 'CLIENTE' },
  ];
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalRecords: number = 0;

  filterConfig: FilterConfig = {
    showTextFilter: true,
    showDateFilter: true,
    lockTextFilter: false,
    lockDateFilter: false,
    manualApply: true, // Enable manual apply for server-side filtering
    fields: [
      { value: 'name', label: 'Nombre' },
      { value: 'code', label: 'Código' },
      { value: 'description', label: 'Descripción' }
    ],
    defaultDateRange: {
      start: '2026-01-01',
      end: new Date().toISOString().split('T')[0]
    }
  };

  tableColumns: TableColumn[] = [];
  tableData: any[] = [];

  ngOnInit() {
    this.fetchDataFromAPI();
  }

  onPlazaChange(plaza: string) {
    this.selectedPlaza = plaza;
    this.currentPage = 1;
    
    // Reset filters when plaza changes
    this.filterConfig = {
      showTextFilter: true,
      showDateFilter: true,
      lockTextFilter: false,
      lockDateFilter: false,
      manualApply: true,
      fields: [
        { value: 'name', label: 'Nombre' },
        { value: 'code', label: 'Código' },
        { value: 'description', label: 'Descripción' }
      ],
      defaultDateRange: {
        start: '2026-01-01',
        end: new Date().toISOString().split('T')[0]
      }
    };
    
    this.currentFilters = null;
    
    console.log('Plaza changed to:', plaza, 'Table:', this.selectedTable);
    
    this.fetchDataFromAPI();
  }

  onFilterChange(filters: FilterValues) {
    this.currentFilters = filters;
    this.currentPage = 1;
    
    console.log('Filters applied:', filters);
    
    this.fetchDataFromAPI();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    
    console.log('Page changed to:', page);
    
    this.fetchDataFromAPI();
  }

  onTableChange(tableName: string) {
    this.selectedTable = tableName;
    
    this.tableColumns = [];
    this.tableData = [];
    
    this.filterConfig = {
      showTextFilter: true,
      showDateFilter: true,
      lockTextFilter: false,
      lockDateFilter: false,
      manualApply: true,
      fields: [
        { value: 'name', label: 'Nombre' },
        { value: 'code', label: 'Código' },
        { value: 'description', label: 'Descripción' }
      ],
      defaultDateRange: {
        start: '2026-01-01',
        end: new Date().toISOString().split('T')[0]
      }
    };
    
    this.currentPage = 1;
    this.currentFilters = null;
    
    console.log('Table changed to:', tableName, 'Plaza:', this.selectedPlaza);
    
    this.fetchDataFromAPI();
  }

  /**
   * Fetch data from API with current filters and pagination
   * This method will be used when the API is ready
   */
  fetchDataFromAPI() {
    this.isLoading = true;

    const request: TableDataRequest = {
      tableName: this.selectedTable,
      paginationContext: {
        page: this.currentPage,
        pageSize: this.pageSize
      }
    };

    if (this.currentFilters?.dateRange?.start || this.currentFilters?.dateRange?.end) {
      request.dateRange = {
        start: this.currentFilters.dateRange?.start || undefined,
        end: this.currentFilters.dateRange?.end || undefined
      };
    }

    if (this.currentFilters?.searchText && this.currentFilters?.selectedField) {
      request.searchText = this.currentFilters.searchText;
      request.searchField = this.currentFilters.selectedField;
    }

    if (this.selectedPlaza) {
      request.city = this.selectedPlaza;
    }

    console.log('=== Fetching Data ===');
    console.log('Current Page:', this.currentPage);
    console.log('Page Size:', this.pageSize);
    console.log('API Request:', request);

    this.rawTablesService.getTableData(request, this.selectedPlaza).subscribe({
      next: (response) => {
        if (!response.success) {
          console.error('API returned success: false');
          this.isLoading = false;
          return;
        }

        this.tableData = response.data;
        this.totalRecords = response.pagination.totalRecords;
        
        console.log('=== API Response ===');
        console.log('Data rows received:', response.data.length);
        console.log('Total records:', response.pagination.totalRecords);
        console.log('Current page from API:', response.pagination.page);
        console.log('Page size from API:', response.pagination.pageSize);
        
        if (response.metadata && response.metadata.length > 0) {
          this.tableColumns = response.metadata.map(col => ({
            key: col.column_name,
            label: col.column_name,
            type: this.mapDataTypeToColumnType(col.data_type),
            width: col.character_maximum_length ? `${Math.min(col.character_maximum_length * 8, 300)}px` : undefined
          }));

          this.filterConfig = {
            ...this.filterConfig,
            fields: response.metadata.map(col => ({
              value: col.column_name,
              label: col.column_name
            }))
          };
        }

        if (response.tableConfig) {
          this.currentDateField = response.tableConfig.date_field;
          this.updateFilterConfigForTable(response.tableConfig.date, response.tableConfig.date_field);
        }
        
        this.isLoading = false;
        console.log('API Response:', response);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    });
  }

  private updateFilterConfigForTable(hasDateField: boolean, dateFieldName: string) {
    this.filterConfig = {
      ...this.filterConfig,
      showDateFilter: hasDateField,
      lockDateFilter: !hasDateField
    };

    if (!hasDateField && this.currentFilters?.dateRange) {
      this.currentFilters = {
        ...this.currentFilters,
        dateRange: { start: null, end: null }
      };
    }
  }

  private mapDataTypeToColumnType(dataType: string): 'text' | 'number' | 'date' | 'boolean' {
    const lowerType = dataType.toLowerCase();
    if (lowerType.includes('int') || lowerType.includes('decimal') || lowerType.includes('numeric') || lowerType.includes('float')) {
      return 'number';
    }
    if (lowerType.includes('date') || lowerType.includes('time')) {
      return 'date';
    }
    if (lowerType.includes('bool') || lowerType.includes('bit')) {
      return 'boolean';
    }
    return 'text';
  }
}
