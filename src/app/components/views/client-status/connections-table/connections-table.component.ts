import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { TablePaginationComponent } from '../../../shared/table-pagination/table-pagination.component';
import { ClientStatusService, ClientConnection } from '../../../../services/client-status.service';

interface Connection {
  client_id: string;
  city: string;
  location: string;
  last_seen: string;
  status?: 'Connected' | 'Disconnected' | 'Error';
}

@Component({
  selector: 'app-connections-table',
  imports: [CommonModule, NbCardModule, NbIconModule, NbEvaIconsModule, NbInputModule, NbButtonModule, FormsModule, TablePaginationComponent],
  templateUrl: './connections-table.component.html',
  styleUrl: './connections-table.component.scss'
})
export class ConnectionsTableComponent implements OnInit, OnChanges {
  @Input() selectedCity: string = 'xalap';
  
  isLoading: boolean = false;
  
  connections: Connection[] = [];
  filteredConnections: Connection[] = [];
  paginatedConnections: Connection[] = [];
  searchTerm: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;
  
  // Expose Math for template
  Math = Math;

  constructor(private clientStatusService: ClientStatusService) {}

  ngOnInit() {
    this.fetchClientConnections();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCity'] && !changes['selectedCity'].firstChange) {
      this.fetchClientConnections();
    }
  }

  fetchClientConnections() {
    this.isLoading = true;
    
    this.clientStatusService.getClientConnections(this.selectedCity).subscribe({
      next: (response) => {
        if (response.success) {
          this.connections = response.data.map(conn => ({
            ...conn,
            status: this.determineStatus(conn.last_seen)
          }));
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching client connections:', error);
        this.isLoading = false;
      }
    });
  }

  determineStatus(lastSeen: string): 'Connected' | 'Disconnected' | 'Error' {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    
    // Check if last seen was today
    const isToday = lastSeenDate.toDateString() === now.toDateString();
    
    // Connected: less than 2 hours ago
    if (diffMinutes < 120) return 'Connected';
    
    // Disconnected: today but more than 2 hours ago
    if (isToday && diffMinutes >= 120) return 'Disconnected';
    
    // Error: not today
    return 'Error';
  }

  refreshData() {
    this.fetchClientConnections();
  }

  filterConnections() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.connections];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(conn =>
        conn.client_id.toLowerCase().includes(term) ||
        conn.location.toLowerCase().includes(term) ||
        (conn.status && conn.status.toLowerCase().includes(term))
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

  formatLastSeen(lastSeen: string): string {
    const date = new Date(lastSeen);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

    
}
