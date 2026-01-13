import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbSelectModule } from "@nebular/theme";
import { FormsModule } from '@angular/forms';

export interface Plaza {
  value: string;
  label: string;
}

@Component({
  selector: 'app-plaza-selector',
  imports: [CommonModule, NbCardModule, NbSelectModule, FormsModule],
  templateUrl: './plaza-selector.component.html',
  styleUrl: './plaza-selector.component.scss'
})
export class PlazaSelectorComponent {
  @Input() selectedPlaza: string = 'xalap';
  @Output() selectedPlazaChange = new EventEmitter<string>();

  plazas: Plaza[] = [
    { value: 'xalap', label: 'Xalapa' },
    { value: 'Guadalajara', label: 'Guadalajara' },
    { value: 'Hermosillo', label: 'Hermosillo' }
  ];

  onPlazaChange(value: string) {
    this.selectedPlaza = value;
    this.selectedPlazaChange.emit(value);
  }
}
