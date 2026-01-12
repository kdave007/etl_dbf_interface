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
  selectedPlaza: string = 'Xalapa';
  selectedTable: string = 'CANOTA';
  isLoading: boolean = false;
  currentFilters: FilterValues | null = null;

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
  pageSize: number = 10;
  totalRecords: number = 0;
  paginatedData: any[] = [];

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

  // Example table configuration
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number', width: '80px' },
    { key: 'name', label: 'Nombre', type: 'text' },
    { key: 'code', label: 'Código', type: 'text' },
    { key: 'description', label: 'Descripción', type: 'text' },
    { key: 'status', label: 'Estado', type: 'text' },
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'active', label: 'Activo', type: 'boolean' },
    { key: 'amount', label: 'Monto', type: 'number' },
    { key: 'category', label: 'Categoría', type: 'text' },
    { key: 'location', label: 'Ubicación', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Teléfono', type: 'text' },
  ];

  allTableData: any[] = [
    { id: 1, name: 'Registro 1', code: 'REG001', description: 'Descripción del registro 1', status: 'Activo', date: '2026-01-01', active: true, amount: 1500, category: 'Categoría A', location: 'Xalapa', email: 'test1@example.com', phone: '555-0001' },
    { id: 2, name: 'Registro 2', code: 'REG002', description: 'Descripción del registro 2', status: 'Inactivo', date: '2026-01-02', active: false, amount: 2500, category: 'Categoría B', location: 'Guadalajara', email: 'test2@example.com', phone: '555-0002' },
    { id: 3, name: 'Registro 3', code: 'REG003', description: 'Descripción del registro 3', status: 'Activo', date: '2026-01-03', active: true, amount: 3500, category: 'Categoría C', location: 'Hermosillo', email: 'test3@example.com', phone: '555-0003' },
    { id: 4, name: 'Registro 4', code: 'REG004', description: 'Descripción del registro 4', status: 'Activo', date: '2026-01-04', active: true, amount: 4500, category: 'Categoría A', location: 'Xalapa', email: 'test4@example.com', phone: '555-0004' },
    { id: 5, name: 'Registro 5', code: 'REG005', description: 'Descripción del registro 5', status: 'Inactivo', date: '2026-01-05', active: false, amount: 5500, category: 'Categoría B', location: 'Guadalajara', email: 'test5@example.com', phone: '555-0005' },
    { id: 6, name: 'Registro 6', code: 'REG006', description: 'Descripción del registro 6', status: 'Activo', date: '2026-01-06', active: true, amount: 6500, category: 'Categoría C', location: 'Hermosillo', email: 'test6@example.com', phone: '555-0006' },
    { id: 7, name: 'Registro 7', code: 'REG007', description: 'Descripción del registro 7', status: 'Activo', date: '2026-01-07', active: true, amount: 7500, category: 'Categoría A', location: 'Xalapa', email: 'test7@example.com', phone: '555-0007' },
    { id: 8, name: 'Registro 8', code: 'REG008', description: 'Descripción del registro 8', status: 'Inactivo', date: '2026-01-08', active: false, amount: 8500, category: 'Categoría B', location: 'Guadalajara', email: 'test8@example.com', phone: '555-0008' },
    { id: 9, name: 'Registro 9', code: 'REG009', description: 'Descripción del registro 9', status: 'Activo', date: '2026-01-09', active: true, amount: 9500, category: 'Categoría C', location: 'Hermosillo', email: 'test9@example.com', phone: '555-0009' },
    { id: 10, name: 'Registro 10', code: 'REG010', description: 'Descripción del registro 10', status: 'Activo', date: '2026-01-10', active: true, amount: 10500, category: 'Categoría A', location: 'Xalapa', email: 'test10@example.com', phone: '555-0010' },
    { id: 11, name: 'Registro 11', code: 'REG011', description: 'Descripción del registro 11', status: 'Inactivo', date: '2026-01-11', active: false, amount: 11500, category: 'Categoría B', location: 'Guadalajara', email: 'test11@example.com', phone: '555-0011' },
    { id: 12, name: 'Registro 12', code: 'REG012', description: 'Descripción del registro 12', status: 'Activo', date: '2026-01-12', active: true, amount: 12500, category: 'Categoría C', location: 'Hermosillo', email: 'test12@example.com', phone: '555-0012' },
  ];

  tableData: any[] = [];

  ngOnInit() {
    // For now, use mock data since API is not ready
    // When API is ready, uncomment the fetchData() call
    this.applyFilters();
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
    
    // For now, use mock data. When API is ready, uncomment:
    // this.fetchDataFromAPI();
    this.applyFilters();
  }

  onFilterChange(filters: FilterValues) {
    this.currentFilters = filters;
    this.currentPage = 1; // Reset to first page when filters change
    
    console.log('Filters applied:', filters);
    
    // For now, use mock data. When API is ready, uncomment:
    // this.fetchDataFromAPI();
    this.applyFilters();
  }

  applyFilters() {
    // Filter by plaza
    let filtered = this.allTableData.filter(item => item.location === this.selectedPlaza);
    
    this.totalRecords = filtered.length;
    this.updatePagination(filtered);
  }

  updatePagination(data: any[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = data.slice(startIndex, endIndex);
    this.tableData = this.paginatedData;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    
    console.log('Page changed to:', page);
    
    // For now, use mock data. When API is ready, uncomment:
    // this.fetchDataFromAPI();
    this.applyFilters();
  }

  onTableChange(tableName: string) {
    this.selectedTable = tableName;
    
    // Reset all filters except plaza selector by creating a new config object
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
    this.currentFilters = null; // Reset filters
    
    console.log('Table changed to:', tableName, 'Plaza:', this.selectedPlaza);
    
    // For now, use mock data. When API is ready, uncomment:
    // this.fetchDataFromAPI();
    this.applyFilters();
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

    if (this.selectedPlaza) {
      request.city = this.selectedPlaza;
    }

    console.log('API Request:', request);

    this.rawTablesService.getTableData(request, this.selectedPlaza).subscribe({
      next: (response) => {
        this.tableData = response.data;
        this.totalRecords = response.pagination.totalRecords;
        
        if (response.metadata && response.metadata.length > 0) {
          this.tableColumns = response.metadata.map(col => ({
            key: col.column_name,
            label: col.column_name,
            type: this.mapDataTypeToColumnType(col.data_type),
            width: col.character_maximum_length ? `${Math.min(col.character_maximum_length * 8, 300)}px` : undefined
          }));
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
