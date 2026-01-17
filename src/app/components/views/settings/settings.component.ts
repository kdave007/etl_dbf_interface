import { Component } from '@angular/core';
import { PlazaSelectorComponent } from '../../shared/plaza-selector/plaza-selector.component'
import { SetupViewComponent } from './setup-view/setup-view.component';

@Component({
  selector: 'app-settings',
  imports: [PlazaSelectorComponent, SetupViewComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
onPlazaChange($event: string) {
throw new Error('Method not implemented.');
}
selectedCity: any;
  constructor(){
        
  }

}
