import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbSelectModule, NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';

@Component({
  selector: 'app-setup-view',
  imports: [NbCardModule, NbSelectModule, CommonModule, FormsModule, NbButtonModule, NbIconModule, NbInputModule],
  templateUrl: './setup-view.component.html',
  styleUrl: './setup-view.component.scss'
})
export class SetupViewComponent {
  selectedSucursal: any;
  sucursales: Array<{value: string, label: string}> = [
    { value: 'ANIMA', label: 'ANIMA' },
    { value: 'XALAP', label: 'XALAP' },
    { value: 'ROTON', label: 'ROTON' },
    { value: 'ARAUC', label: 'ARAUC' },
    { value: 'CIRCUN', label: 'CIRCUN' }
  ];

  config = {
    CREATE: '',
    CUSTOM_DATE_RANGE: 1,
    DBF_CHUNKS_SIZE: 500,
    DB_NAME: '',
    DEBUG: 0,
    DELETE: '',
    END_DATE: 0,
    POST_API_BASE: '',
    SQL_ENABLED: 1,
    START_DATE: '',
    STATUS_API_BASE: '',
    STOP_FLAG: 0,
    UPDATE: '',
    VERSION: ''
  };

  private originalConfig = { ...this.config };

  onSucursalChange(event: any) {
    console.log('Sucursal changed:', event);
  }

  saveConfig() {
    console.log('Saving configuration:', this.config);
  }

  resetConfig() {
    this.config = { ...this.originalConfig };
    console.log('Configuration reset');
  }
}
