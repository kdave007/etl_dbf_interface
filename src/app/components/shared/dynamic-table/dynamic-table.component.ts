import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbIconModule, NbSelectModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean';
  width?: string;
}

export interface TableOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    NbEvaIconsModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showAllColumns: boolean = false;
  @Input() defaultVisibleColumns: number = 10;
  @Input() tableOptions: TableOption[] = [];
  @Input() selectedTable: string = '';
  @Output() tableChange = new EventEmitter<string>();

  visibleColumns: TableColumn[] = [];
  showAll: boolean = false;

  ngOnInit() {
    this.showAll = this.showAllColumns;
    this.updateVisibleColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.updateVisibleColumns();
    }
  }

  updateVisibleColumns() {
    if (this.showAll) {
      this.visibleColumns = [...this.columns];
    } else {
      this.visibleColumns = this.columns.slice(0, this.defaultVisibleColumns);
    }
  }

  toggleColumnVisibility() {
    this.showAll = !this.showAll;
    this.updateVisibleColumns();
  }

  getCellValue(row: any, column: TableColumn): any {
    return row[column.key];
  }

  formatValue(value: any, type?: string): string {
    if (value === null || value === undefined) {
      return '-';
    }

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return String(value);
    }
  }

  onTableChange() {
    this.tableChange.emit(this.selectedTable);
  }
}
