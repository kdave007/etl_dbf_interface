import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@Component({
  selector: 'app-table-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, NbButtonModule, NbIconModule, NbInputModule, NbEvaIconsModule],
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.scss'
})
export class TablePaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalRecords: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  pageInput: number = 1;

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  firstPage() {
    this.goToPage(1);
  }

  lastPage() {
    this.goToPage(this.totalPages);
  }

  goToInputPage() {
    const page = Number(this.pageInput);
    if (page >= 1 && page <= this.totalPages) {
      this.goToPage(page);
    } else {
      this.pageInput = this.currentPage;
    }
  }
}
