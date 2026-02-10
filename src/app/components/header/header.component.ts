import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbButtonModule, NbIconModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbMenuItem, NbMenuService } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthService } from '../../services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NbLayoutModule, NbButtonModule, NbIconModule, NbEvaIconsModule, NbUserModule, NbActionsModule, NbContextMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  currentUser: string = 'Usuario';

  userMenu: NbMenuItem[] = [
    {
      title: 'Cerrar Sesión',
      icon: 'log-out-outline'
    }
  ];

  constructor(
    private authService: AuthService,
    private menuService: NbMenuService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.username;
    }

    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-context-menu'),
        takeUntil(this.destroy$)
      )
      .subscribe(({ item }) => {
        if (item.title === 'Cerrar Sesión') {
          this.authService.logout();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
