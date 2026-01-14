import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbSelectModule, NbInputModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

export interface FilterField {
  value: string;
  label: string;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface FilterConfig {
  showTextFilter?: boolean;
  showDateFilter?: boolean;
  lockTextFilter?: boolean;
  lockDateFilter?: boolean;
  fields?: FilterField[];
  defaultDateRange?: DateRange;
  manualApply?: boolean; // If true, only emit on Apply button click (for server-side filtering)
}

export interface FilterValues {
  searchText: string;
  selectedField: string;
  dateRange: DateRange;
}

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NbCardModule, 
    NbSelectModule, 
    NbInputModule, 
    NbButtonModule,
    NbIconModule,
    NbEvaIconsModule
  ],
  templateUrl: './advanced-filter.component.html',
  styleUrl: './advanced-filter.component.scss'
})
export class AdvancedFilterComponent implements OnInit {
  @Input() config: FilterConfig = {
    showTextFilter: true,
    showDateFilter: true,
    lockTextFilter: false,
    lockDateFilter: false,
    fields: [],
    defaultDateRange: { start: null, end: null },
    manualApply: false
  };
  
  @Output() filterChange = new EventEmitter<FilterValues>();

  searchText: string = '';
  selectedField: string = '';
  dateRange: DateRange = { start: null, end: null };

  ngOnInit() {
    // Set default field if available
    if (this.config.fields && this.config.fields.length > 0) {
      this.selectedField = this.config.fields[0].value;
    }

    // Set default date range if provided
    if (this.config.defaultDateRange) {
      this.dateRange = { ...this.config.defaultDateRange };
    }

    // Emit initial filter state only if not in manual mode
    if (!this.config.manualApply) {
      this.emitFilterChange();
    }
  }

  onSearchChange() {
    if (!this.config.manualApply) {
      this.emitFilterChange();
    }
  }

  onFieldChange() {
    if (!this.config.manualApply) {
      this.emitFilterChange();
    }
  }

  onDateRangeChange() {
    if (!this.config.manualApply) {
      this.emitFilterChange();
    }
  }

  applyFilters() {
    this.emitFilterChange();
  }

  clearFilters() {
    if (!this.config.lockTextFilter) {
      this.searchText = '';
      if (this.config.fields && this.config.fields.length > 0) {
        this.selectedField = this.config.fields[0].value;
      }
    }
    
    if (!this.config.lockDateFilter) {
      this.dateRange = { start: null, end: null };
    }
    
    // Always emit when clearing filters to reload data without filters
    this.emitFilterChange();
  }

  private emitFilterChange() {
    this.filterChange.emit({
      searchText: this.searchText,
      selectedField: this.selectedField,
      dateRange: { ...this.dateRange }
    });
  }
}
