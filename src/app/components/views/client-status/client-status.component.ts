import { Component } from '@angular/core';
import { PlazaSelectorComponent } from '../../shared/plaza-selector/plaza-selector.component';
import { ConnectionsTableComponent } from './connections-table/connections-table.component';

@Component({
  selector: 'app-client-status',
  imports: [PlazaSelectorComponent, ConnectionsTableComponent],
  templateUrl: './client-status.component.html',
  styleUrl: './client-status.component.scss'
})
export class ClientStatusComponent {
  selectedCity: string = 'xalap';

  onPlazaChange(plaza: string) {
    this.selectedCity = plaza;
  }
}
