import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = 'ai-career-navigator';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Debug all router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('🚀 Navigation Start:', event.url);
        console.log('📍 Current Location:', this.location.path());
        console.log('🌐 Browser URL:', window.location.href);
        console.log('📚 History Length:', window.history.length);
      }

      if (event instanceof NavigationEnd) {
        console.log('✅ Navigation End:', event.url);
        console.log('📍 Final Location:', this.location.path());
        console.log('🌐 Final Browser URL:', window.location.href);
        console.log('---');
      }

      if (event instanceof NavigationCancel) {
        console.log('❌ Navigation Cancelled:', event.url, event.reason);
      }

      if (event instanceof NavigationError) {
        console.log('💥 Navigation Error:', event.url, event.error);
      }
    });

    // Debug browser history events
    window.addEventListener('popstate', (event) => {
      console.log('🔙 PopState Event Triggered');
      console.log('📍 Current Location:', this.location.path());
      console.log('🌐 Browser URL:', window.location.href);
      console.log('📚 History Length:', window.history.length);
      console.log('📦 Event State:', event.state);
      console.log('---');
    });

    // Debug page load/refresh
    console.log('🏁 App Initialized');
    console.log('📍 Initial Location:', this.location.path());
    console.log('🌐 Initial Browser URL:', window.location.href);
    console.log('📚 Initial History Length:', window.history.length);
    console.log('---');
  }
}
