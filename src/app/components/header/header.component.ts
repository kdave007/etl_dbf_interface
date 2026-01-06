import { Component, Output, EventEmitter } from '@angular/core';
import { NbLayoutModule, NbButtonModule, NbIconModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbMenuItem } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@Component({
  selector: 'app-header',
  imports: [NbLayoutModule, NbButtonModule, NbIconModule, NbEvaIconsModule, NbUserModule, NbActionsModule, NbContextMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  userMenu: NbMenuItem[] = [
    {
      title: 'Profile',
      icon: 'person-outline'
    },
    {
      title: 'Settings',
      icon: 'settings-2-outline'
    },
    {
      title: 'Logout',
      icon: 'log-out-outline'
    }
  ];

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
