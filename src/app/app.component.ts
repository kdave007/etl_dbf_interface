import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbSidebarModule, NbSidebarService } from '@nebular/theme';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NbLayoutModule, NbSidebarModule, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showLayout = true;

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showLayout = !event.url.includes('/login');
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle(false, 'menu-sidebar');
  }
}
