import { Component } from '@angular/core';
import { NbMenuItem, NbMenuModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@Component({
  selector: 'app-sidebar',
  imports: [NbMenuModule, NbIconModule, NbEvaIconsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: NbMenuItem[] = [
    {
      title: 'Estatus',
      icon: 'home-outline',
      link: '/estatus',
      home: true
    },
    {
      title: 'Estadística',
      icon: 'grid-outline',
      link: '/estadistica'
    },
    {
      title: 'Tablas',
      icon: 'grid-outline',
      link: '/tablas'
    },
    // {
    //   title: 'ETL Operations',
    //   icon: 'swap-outline',
    //   expanded: false,
    //   children: [
    //     {
    //       title: 'Import DBF',
    //       icon: 'download-outline',
    //       link: '/etl/import'
    //     },
    //     {
    //       title: 'Export Data',
    //       icon: 'upload-outline',
    //       link: '/etl/export'
    //     },
    //     {
    //       title: 'Transform',
    //       icon: 'shuffle-2-outline',
    //       link: '/etl/transform'
    //     }
    //   ]
    // },
    // {
    //   title: 'Data Management',
    //   icon: 'database-outline',
    //   expanded: false,
    //   children: [
    //     {
    //       title: 'Tables',
    //       icon: 'grid-outline',
    //       link: '/data/tables'
    //     },
    //     {
    //       title: 'Queries',
    //       icon: 'search-outline',
    //       link: '/data/queries'
    //     },
    //     {
    //       title: 'History',
    //       icon: 'clock-outline',
    //       link: '/data/history'
    //     }
    //   ]
    // },
    {
      title: 'Settings',
      icon: 'settings-2-outline',
      link: '/configuracion'
    },
    {
      title: 'Help',
      icon: 'question-mark-circle-outline',
      link: '/help'
    }
  ];
}
