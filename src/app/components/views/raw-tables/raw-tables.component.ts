import { Component } from '@angular/core';
import { TablePaginationComponent } from '../../shared/table-pagination/table-pagination.component';
import { AdvancedFilterComponent, FilterConfig, FilterValues } from '../../shared/advanced-filter/advanced-filter.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';

@Component({
  selector: 'app-raw-tables',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbIconModule, NbEvaIconsModule, NbInputModule, NbButtonModule, FormsModule, TablePaginationComponent, AdvancedFilterComponent],
  templateUrl: './raw-tables.component.html',
  styleUrl: './raw-tables.component.scss',
})
export class RawTablesComponent {
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

  onFilterChange(filters: FilterValues) {
    console.log('Filters to send to API:', filters);
    // Send filters to your API here
    // this.apiService.getData(filters).subscribe(...)
  }
}
