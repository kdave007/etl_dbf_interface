import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { TablePaginationComponent } from '../../../shared/table-pagination/table-pagination.component';

interface Connection {
  id: number;
  clientName: string;
  city: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  database: string;
}

@Component({
  selector: 'app-connections-table',
  imports: [CommonModule, NbCardModule, NbIconModule, NbEvaIconsModule, NbInputModule, NbButtonModule, FormsModule, TablePaginationComponent],
  templateUrl: './connections-table.component.html',
  styleUrl: './connections-table.component.scss'
})
export class ConnectionsTableComponent implements OnInit, OnChanges {
  @Input() selectedCity: string = 'Xalapa';
  
  connections: Connection[] = [];
  filteredConnections: Connection[] = [];
  paginatedConnections: Connection[] = [];
  searchTerm: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  
  // Expose Math for template
  Math = Math;

  /*****
     * {
    "data": [
      {
        "id": 1,
        "clientName": "Client A",
        "city": "Xalapa",
        "status": "Connected",
        "lastSync": "2026-01-06 16:05:00",
        "database": "SALES_DB"
      }
      // ... more records
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 5,
      "totalRecords": 12,
      "totalPages": 3
    }
    * */

  ngOnInit() {
    this.connections = [
      {
        id: 1,
        clientName: 'Client A',
        city: 'Xalapa',
        status: 'Connected',
        lastSync: '2026-01-06 16:05:00',
        database: 'SALES_DB'
      },
      {
        id: 2,
        clientName: 'Client B',
        city: 'Xalapa',
        status: 'Connected',
        lastSync: '2026-01-06 16:03:00',
        database: 'INVENTORY_DB'
      },
      {
        id: 3,
        clientName: 'Client C',
        city: 'Guadalajara',
        status: 'Disconnected',
        lastSync: '2026-01-06 15:45:00',
        database: 'ORDERS_DB'
      },
      {
        id: 4,
        clientName: 'Client D',
        city: 'Guadalajara',
        status: 'Error',
        lastSync: '2026-01-06 14:30:00',
        database: 'CUSTOMERS_DB'
      },
      {
        id: 5,
        clientName: 'Client E',
        city: 'Hermosillo',
        status: 'Connected',
        lastSync: '2026-01-06 16:07:00',
        database: 'PRODUCTS_DB'
      },
      {
        id: 6,
        clientName: 'Client F',
        city: 'Hermosillo',
        status: 'Connected',
        lastSync: '2026-01-06 16:08:00',
        database: 'ANALYTICS_DB'
      }
    ];
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCity']) {
      this.applyFilters();
    }
  }

  filterConnections() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.connections];

    // Filter by city (always filter by selected city)
    filtered = filtered.filter(conn => conn.city === this.selectedCity);

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(conn =>
        conn.clientName.toLowerCase().includes(term) ||
        conn.status.toLowerCase().includes(term) ||
        conn.database.toLowerCase().includes(term)
      );
    }

    this.filteredConnections = filtered;
    this.updatePagination();
  }

  updatePagination() {
    // Calculate total pages
    this.totalPages = Math.ceil(this.filteredConnections.length / this.pageSize);
    
    // Reset to page 1 if current page is out of bounds
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Get paginated data
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedConnections = this.filteredConnections.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Connected': return 'checkmark-circle-outline';
      case 'Disconnected': return 'close-circle-outline';
      case 'Error': return 'alert-triangle-outline';
      default: return 'question-mark-circle-outline';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Connected': return 'status-connected';
      case 'Disconnected': return 'status-disconnected';
      case 'Error': return 'status-error';
      default: return '';
    }
  }

  getCityLabel(cityValue: string): string {
    const cityMap: { [key: string]: string } = {
      'new-york': 'New York',
      'los-angeles': 'Los Angeles',
      'chicago': 'Chicago',
      'houston': 'Houston',
      'miami': 'Miami'
    };
    return cityMap[cityValue] || cityValue;
  }

    
}
