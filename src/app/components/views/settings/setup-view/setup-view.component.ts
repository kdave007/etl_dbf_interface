import { Component, Input, OnInit, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbSelectModule, NbButtonModule, NbIconModule, NbInputModule, NbToggleModule, NbDialogModule, NbDialogService, NbCheckboxModule, NbAlertModule, NbToastrService } from '@nebular/theme';
import { SucursalConfigService } from '../../../../services/sucursal-config.service';

@Component({
  selector: 'app-setup-view',
  imports: [NbCardModule, NbSelectModule, CommonModule, FormsModule, NbButtonModule, NbIconModule, NbInputModule, NbToggleModule, NbDialogModule, NbCheckboxModule, NbAlertModule],
  templateUrl: './setup-view.component.html',
  styleUrl: './setup-view.component.scss'
})
export class SetupViewComponent implements OnInit, OnChanges {
  @Input() selectedPlaza: string = 'xalap';
  @ViewChild('copyToStoresDialog') copyToStoresDialog!: TemplateRef<any>;
  
  constructor(
    private sucursalConfigService: SucursalConfigService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}
  selectedSucursal: any;
  loading = false;
  loadingSucursales = false;
  error: string | null = null;
  
  plazas: Array<{value: string, label: string}> = [
    { value: 'XALAP', label: 'Xalapa' },
    { value: 'CHETU', label: 'Chetumal' },
    { value: 'PENLA', label: 'Peninsula' },
    { value: 'VALLA', label: 'Vallarta' },
    { value: 'MANZA', label: 'Manzanillo' },
    { value: 'REYES', label: 'Reyes' },
    { value: 'GUADA', label: 'Guadalajara' }
  ];
  
  sucursales: Array<{value: string, label: string}> = [];

  config = {
    COMMAND_LINE: '',
    CREATE: '',
    CUSTOM_DATE_RANGE: false,
    DBF_CHUNKS_SIZE: 500,
    DB_NAME: '',
    DEBUG: false,
    DELETE: '',
    END_DATE: 0,
    KEY_ID_BYPASS: false,
    NIGHT_SYNC_ENABLED: false,
    NIGHT_SYNC_END: '',
    NIGHT_SYNC_START: '',
    POST_API_BASE: '',
    SPECIAL_OPS: false,
    SQL_ENABLED: false,
    START_DATE: '',
    STATUS_API_BASE: '',
    STOP_FLAG: false,
    TABLES: '',
    UPDATE: '',
    VERSION: ''
  };

  private originalConfig = { ...this.config };

  ngOnInit() {
    if (this.selectedPlaza) {
      this.loadSucursales(this.selectedPlaza);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPlaza'] && !changes['selectedPlaza'].firstChange) {
      this.selectedSucursal = null;
      this.sucursales = [];
      if (this.selectedPlaza) {
        this.loadSucursales(this.selectedPlaza);
      }
    }
  }

  loadSucursales(plaza: string) {
    this.loadingSucursales = true;
    this.error = null;
    
    const cityMap: Record<string, string> = {
      'xalap': 'XALAP'
    };
    
    const city = cityMap[plaza] || plaza.toUpperCase();
    
    this.sucursalConfigService.getSucursalesByCity(city, plaza)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sucursales = response.data.map(sucursal => ({
              value: sucursal.client_id,
              label: sucursal.tienda
            }));
            this.loadingSucursales = false;
          }
        },
        error: (err) => {
          console.error('Error fetching sucursales:', err);
          this.error = 'Failed to load sucursales list';
          this.loadingSucursales = false;
        }
      });
  }

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
              COMMAND_LINE: configObj['COMMAND_LINE'] || '',
              CREATE: configObj['CREATE'] || '',
              CUSTOM_DATE_RANGE: configObj['CUSTOM_DATE_RANGE'] === '1' || configObj['CUSTOM_DATE_RANGE'] === 'true',
              DBF_CHUNKS_SIZE: parseInt(configObj['DBF_CHUNKS_SIZE'] || '500'),
              DB_NAME: configObj['DB_NAME'] || '',
              DEBUG: configObj['DEBUG'] === '1' || configObj['DEBUG'] === 'true',
              DELETE: configObj['DELETE'] || '',
              END_DATE: parseInt(configObj['END_DATE'] || '0'),
              KEY_ID_BYPASS: configObj['KEY_ID_BYPASS'] === '1' || configObj['KEY_ID_BYPASS'] === 'true',
              NIGHT_SYNC_ENABLED: configObj['NIGHT_SYNC_ENABLED'] === '1' || configObj['NIGHT_SYNC_ENABLED'] === 'true',
              NIGHT_SYNC_END: configObj['NIGHT_SYNC_END'] || '',
              NIGHT_SYNC_START: configObj['NIGHT_SYNC_START'] || '',
              POST_API_BASE: configObj['POST_API_BASE'] || '',
              SPECIAL_OPS: configObj['SPECIAL_OPS'] === '1' || configObj['SPECIAL_OPS'] === 'true',
              SQL_ENABLED: configObj['SQL_ENABLED'] === '1' || configObj['SQL_ENABLED'] === 'true',
              START_DATE: configObj['START_DATE'] || '',
              STATUS_API_BASE: configObj['STATUS_API_BASE'] || '',
              STOP_FLAG: configObj['STOP_FLAG'] === '1' || configObj['STOP_FLAG'] === 'true',
              TABLES: configObj['TABLES'] || '',
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

  savingConfig = false;

  saveConfig() {
    if (!this.selectedSucursal) {
      return;
    }

    this.savingConfig = true;
    this.error = null;

    this.sucursalConfigService.updateSucursalConfig(this.selectedSucursal, this.config, this.selectedPlaza)
      .subscribe({
        next: (response: any) => {
          console.log('Configuration saved successfully', response);
          this.originalConfig = { ...this.config };
          this.savingConfig = false;
          this.toastrService.success('Configuración guardada exitosamente', 'Éxito');
        },
        error: (err: any) => {
          console.error('Error saving configuration:', err);
          this.error = 'Failed to save configuration';
          this.savingConfig = false;
          this.toastrService.danger('Error al guardar la configuración', 'Error');
        }
      });
  }

  resetConfig() {
    this.config = { ...this.originalConfig };
    console.log('Configuration reset');
  }

  selectedStoresForCopy: Set<string> = new Set();
  copyingToStores = false;

  openCopyToStoresModal() {
    if (!this.selectedSucursal) {
      return;
    }
    
    this.selectedStoresForCopy.clear();
    this.dialogService.open(this.copyToStoresDialog, {
      context: {
        availableStores: this.sucursales.filter(s => s.value !== this.selectedSucursal)
      }
    });
  }

  toggleStoreSelection(storeId: string) {
    if (this.selectedStoresForCopy.has(storeId)) {
      this.selectedStoresForCopy.delete(storeId);
    } else {
      this.selectedStoresForCopy.add(storeId);
    }
  }

  isStoreSelected(storeId: string): boolean {
    return this.selectedStoresForCopy.has(storeId);
  }

  selectAllStores() {
    this.sucursales
      .filter(s => s.value !== this.selectedSucursal)
      .forEach(s => this.selectedStoresForCopy.add(s.value));
  }

  clearAllStores() {
    this.selectedStoresForCopy.clear();
  }

  copyConfigToStores(dialogRef: any) {
    if (this.selectedStoresForCopy.size === 0) {
      return;
    }

    this.copyingToStores = true;
    const configToCopy = { ...this.config };
    delete (configToCopy as any).DB_NAME;

    const storeIds = Array.from(this.selectedStoresForCopy);
    
    this.sucursalConfigService.updateMultipleSucursales(storeIds, configToCopy, this.selectedPlaza)
      .subscribe({
        next: (response: any) => {
          console.log('Configuration copied successfully', response);
          this.copyingToStores = false;
          dialogRef.close();
          this.toastrService.success(`Configuración copiada a ${storeIds.length} tienda(s)`, 'Éxito');
        },
        error: (err: any) => {
          console.error('Error copying configuration:', err);
          this.error = 'Failed to copy configuration to stores';
          this.copyingToStores = false;
          this.toastrService.danger('Error al copiar la configuración', 'Error');
        }
      });
  }
}
