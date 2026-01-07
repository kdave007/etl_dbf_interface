import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule } from "@nebular/theme";
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PlazaSelectorComponent } from '../../shared/plaza-selector/plaza-selector.component';
import { TablePaginationComponent } from '../../shared/table-pagination/table-pagination.component';

interface CitySyncStat {
  city: string;
  total: number;
  connected: number;
  disconnected: number;
  errors: number;
  connectivity: number;
}

interface DatabaseStat {
  name: string;
  records: number;
  lastUpdate: string;
  sizeMB: number;
  status: 'Activa' | 'Sincronizando' | 'Error';
}

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, NbCardModule, NbIconModule, NbEvaIconsModule, PlazaSelectorComponent, TablePaginationComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  selectedPlaza: string = 'Xalapa';
  citySyncStats: CitySyncStat[] = [];
  filteredCitySyncStats: CitySyncStat[] = [];
  paginatedCitySyncStats: CitySyncStat[] = [];
  databaseStats: DatabaseStat[] = [];
  filteredDatabaseStats: DatabaseStat[] = [];
  paginatedDatabaseStats: DatabaseStat[] = [];
  
  // Pagination for sync stats table
  syncStatsPage: number = 1;
  syncStatsPageSize: number = 5;
  
  // Pagination for database stats table
  dbStatsPage: number = 1;
  dbStatsPageSize: number = 5;

  ngOnInit() {
    this.citySyncStats = [
      {
        city: 'Xalapa',
        total: 8,
        connected: 6,
        disconnected: 1,
        errors: 1,
        connectivity: 75
      },
      {
        city: 'Guadalajara',
        total: 12,
        connected: 10,
        disconnected: 2,
        errors: 0,
        connectivity: 83
      },
      {
        city: 'Hermosillo',
        total: 6,
        connected: 5,
        disconnected: 0,
        errors: 1,
        connectivity: 83
      }
    ];

    this.databaseStats = [
      {
        name: 'SALES_DB',
        records: 125430,
        lastUpdate: '2026-01-07 13:05:00',
        sizeMB: 245.8,
        status: 'Activa'
      },
      {
        name: 'INVENTORY_DB',
        records: 89234,
        lastUpdate: '2026-01-07 13:03:00',
        sizeMB: 178.3,
        status: 'Activa'
      },
      {
        name: 'ORDERS_DB',
        records: 234567,
        lastUpdate: '2026-01-07 12:45:00',
        sizeMB: 412.6,
        status: 'Sincronizando'
      },
      {
        name: 'CUSTOMERS_DB',
        records: 45678,
        lastUpdate: '2026-01-07 11:30:00',
        sizeMB: 98.4,
        status: 'Error'
      },
      {
        name: 'PRODUCTS_DB',
        records: 156789,
        lastUpdate: '2026-01-07 13:07:00',
        sizeMB: 289.1,
        status: 'Activa'
      }
    ];
    this.applyFilters();
  }

  onPlazaChange(plaza: string) {
    this.selectedPlaza = plaza;
    this.applyFilters();
  }

  applyFilters() {
    // Filter city sync stats by selected plaza
    this.filteredCitySyncStats = this.citySyncStats.filter(
      stat => stat.city === this.selectedPlaza
    );

    // For database stats, showing all databases regardless of plaza
    this.filteredDatabaseStats = [...this.databaseStats];
    
    // Update pagination for both tables
    this.updateSyncStatsPagination();
    this.updateDbStatsPagination();
  }

  updateSyncStatsPagination() {
    const startIndex = (this.syncStatsPage - 1) * this.syncStatsPageSize;
    const endIndex = startIndex + this.syncStatsPageSize;
    this.paginatedCitySyncStats = this.filteredCitySyncStats.slice(startIndex, endIndex);
  }

  updateDbStatsPagination() {
    const startIndex = (this.dbStatsPage - 1) * this.dbStatsPageSize;
    const endIndex = startIndex + this.dbStatsPageSize;
    this.paginatedDatabaseStats = this.filteredDatabaseStats.slice(startIndex, endIndex);
  }

  onSyncStatsPageChange(page: number) {
    this.syncStatsPage = page;
    this.updateSyncStatsPagination();
  }

  onDbStatsPageChange(page: number) {
    this.dbStatsPage = page;
    this.updateDbStatsPagination();
  }

  getConnectivityClass(connectivity: number): string {
    if (connectivity >= 80) return 'connectivity-good';
    if (connectivity >= 60) return 'connectivity-medium';
    return 'connectivity-low';
  }

  getDbStatusClass(status: string): string {
    switch (status) {
      case 'Activa': return 'status-active';
      case 'Sincronizando': return 'status-syncing';
      case 'Error': return 'status-error';
      default: return '';
    }
  }

  getDbStatusIcon(status: string): string {
    switch (status) {
      case 'Activa': return 'checkmark-circle-outline';
      case 'Sincronizando': return 'sync-outline';
      case 'Error': return 'alert-triangle-outline';
      default: return 'question-mark-circle-outline';
    }
  }
}
