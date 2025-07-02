import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HiringCountriesMapComponent } from './hiring-countries-map.component';

@Component({
  selector: 'app-map-demo',
  standalone: true,
  imports: [CommonModule, HiringCountriesMapComponent],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">
          Interactive Hiring Countries Map Demo
        </h1>
        
        <div class="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <app-hiring-countries-map [countries]="sampleCountries"></app-hiring-countries-map>
        </div>
        
        <div class="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Features:</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Interactive world map with country markers
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Animated markers with country rankings
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Clickable popups with hiring information
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Country legend with focus functionality
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Responsive design for all screen sizes
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MapDemoComponent {
  sampleCountries = [
    'United States',
    'Canada', 
    'United Kingdom',
    'Germany',
    'Netherlands',
    'Sweden',
    'Australia',
    'Singapore',
    'Japan',
    'India',
    'Brazil',
    'Israel',
    'Ireland',
    'Switzerland'
  ];
}
