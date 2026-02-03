import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbSelectModule, NbButtonModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { SucursalConfigService } from '../../../../services/sucursal-config.service';

@Component({
  selector: 'app-setup-view',
  imports: [NbCardModule, NbSelectModule, CommonModule, FormsModule, NbButtonModule, NbIconModule, NbInputModule],
  templateUrl: './setup-view.component.html',
  styleUrl: './setup-view.component.scss'
})
export class SetupViewComponent {
  constructor(private sucursalConfigService: SucursalConfigService) {}
  selectedSucursal: any;
  loading = false;
  error: string | null = null;
  
  sucursales: Array<{value: string, label: string}> = [
    { value: 'XALAP_ANIMA', label: 'ANIMA' },
    { value: 'XALAP_ROTON', label: 'ROTON' },
    { value: 'XALAP_ARAUC', label: 'ARAUC' },
    { value: 'XALAP_CIRCUN', label: 'CIRCUN' }
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
    if (!event) return;
    
    this.loading = true;
    this.error = null;
    
    this.sucursalConfigService.getSucursalConfig(event, 'xalap')
      .subscribe({
        next: (response) => {
          if (response.success) {
            const configObj = this.sucursalConfigService.parseConfigToObject(response.data);
            
            this.config = {
              CREATE: configObj['CREATE'] || '',
              CUSTOM_DATE_RANGE: parseInt(configObj['CUSTOM_DATE_RANGE'] || '1'),
              DBF_CHUNKS_SIZE: parseInt(configObj['DBF_CHUNKS_SIZE'] || '500'),
              DB_NAME: configObj['DB_NAME'] || '',
              DEBUG: parseInt(configObj['DEBUG'] || '0'),
              DELETE: configObj['DELETE'] || '',
              END_DATE: parseInt(configObj['END_DATE'] || '0'),
              POST_API_BASE: configObj['POST_API_BASE'] || '',
              SQL_ENABLED: parseInt(configObj['SQL_ENABLED'] || '1'),
              START_DATE: configObj['START_DATE'] || '',
              STATUS_API_BASE: configObj['STATUS_API_BASE'] || '',
              STOP_FLAG: parseInt(configObj['STOP_FLAG'] || '0'),
              UPDATE: configObj['UPDATE'] || '',
              VERSION: configObj['VERSION'] || ''
            };
            
            this.originalConfig = { ...this.config };
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching sucursal config:', err);
          this.error = 'Failed to load configuration';
          this.loading = false;
        }
      });
  }

  saveConfig() {
    console.log('Saving configuration:', this.config);
  }

  resetConfig() {
    this.config = { ...this.originalConfig };
    console.log('Configuration reset');
  }
}
