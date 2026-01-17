import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientStatusService, ClientConnection } from '../../../../services/client-status.service';
import { Subscription } from 'rxjs';

interface StatusStats {
  connected: number;
  disconnected: number;
  error: number;
  total: number;
  connectedPercent: number;
  disconnectedPercent: number;
  errorPercent: number;
}

@Component({
  selector: 'app-status-chart',
  imports: [CommonModule],
  templateUrl: './status-chart.component.html',
  styleUrl: './status-chart.component.scss'
})
export class StatusChartComponent implements OnDestroy {
  stats: StatusStats = {
    connected: 0,
    disconnected: 0,
    error: 0,
    total: 0,
    connectedPercent: 0,
    disconnectedPercent: 0,
    errorPercent: 0
  };

  private subscription: Subscription;

  constructor(private clientStatusService: ClientStatusService){
    this.subscription = this.clientStatusService.clientStatus$.subscribe((response) => {
      if (response && response.success) {
        this.calculateStats(response.data);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  calculateStats(connections: ClientConnection[]) {
    const stats = {
      connected: 0,
      disconnected: 0,
      error: 0,
      total: connections.length,
      connectedPercent: 0,
      disconnectedPercent: 0,
      errorPercent: 0
    };

    connections.forEach(conn => {
      const status = this.determineStatus(conn.last_seen);
      if (status === 'Connected') stats.connected++;
      else if (status === 'Disconnected') stats.disconnected++;
      else stats.error++;
    });

    if (stats.total > 0) {
      stats.connectedPercent = Math.round((stats.connected / stats.total) * 100);
      stats.disconnectedPercent = Math.round((stats.disconnected / stats.total) * 100);
      stats.errorPercent = Math.round((stats.error / stats.total) * 100);
    }

    this.stats = stats;
  }

  determineStatus(lastSeen: string): 'Connected' | 'Disconnected' | 'Error' {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    
    const isToday = lastSeenDate.toDateString() === now.toDateString();
    
    if (diffMinutes < 120) return 'Connected';
    
    if (isToday && diffMinutes >= 120) return 'Disconnected';
    
    return 'Error';
  }

  getStrokeDasharray(percent: number): string {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference * (percent / 100);
    return `${offset} ${circumference}`;
  }

  getStrokeDashoffset(previousPercents: number): string {
    const circumference = 2 * Math.PI * 45;
    return `${-circumference * (previousPercents / 100)}`;
  }

}
