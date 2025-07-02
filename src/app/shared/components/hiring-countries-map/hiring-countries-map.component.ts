import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

interface CountryCoordinates {
  [key: string]: [number, number]; // [latitude, longitude]
}

@Component({
  selector: 'app-hiring-countries-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full">
      <div class="mb-6">
        <h4 class="font-bold text-gray-900 text-2xl mb-4 flex items-center">
          <svg class="w-6 h-6 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Top Hiring Countries - Interactive Map
        </h4>
        <p class="text-gray-600 text-lg">Click on the markers to see country details</p>
      </div>
      
      <!-- Map Container -->
      <div 
        #mapContainer 
        class="w-full h-96 rounded-2xl border border-teal-200/50 shadow-lg overflow-hidden"
        style="min-height: 400px;">
      </div>
      
      <!-- Countries Legend -->
      <div class="mt-6 bg-white/95 rounded-2xl p-6 border border-teal-200/50 shadow-sm">
        <h5 class="font-bold text-gray-900 text-lg mb-4">Countries on Map:</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div *ngFor="let country of countries; let i = index"
               class="flex items-center p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all duration-300 cursor-pointer"
               (click)="focusOnCountry(country)">
            <div class="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></div>
            <span class="font-medium text-teal-800">{{ country }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .leaflet-popup-content {
      margin: 16px;
      font-family: inherit;
    }
    
    .leaflet-container {
      border-radius: 16px;
    }
  `]
})
export class HiringCountriesMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() countries: string[] = [];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;
  private markers: L.Marker[] = [];

  // Country coordinates mapping (major cities/capitals)
  private countryCoordinates: CountryCoordinates = {
    'United States': [39.8283, -98.5795],
    'USA': [39.8283, -98.5795],
    'Canada': [56.1304, -106.3468],
    'United Kingdom': [55.3781, -3.4360],
    'UK': [55.3781, -3.4360],
    'Germany': [51.1657, 10.4515],
    'France': [46.6034, 1.8883],
    'Netherlands': [52.1326, 5.2913],
    'Sweden': [60.1282, 18.6435],
    'Norway': [60.4720, 8.4689],
    'Denmark': [56.2639, 9.5018],
    'Switzerland': [46.8182, 8.2275],
    'Australia': [-25.2744, 133.7751],
    'New Zealand': [-40.9006, 174.8860],
    'Japan': [36.2048, 138.2529],
    'South Korea': [35.9078, 127.7669],
    'Singapore': [1.3521, 103.8198],
    'India': [20.5937, 78.9629],
    'China': [35.8617, 104.1954],
    'Brazil': [-14.2350, -51.9253],
    'Argentina': [-38.4161, -63.6167],
    'Mexico': [23.6345, -102.5528],
    'Israel': [31.0461, 34.8516],
    'Ireland': [53.4129, -8.2439],
    'Finland': [61.9241, 25.7482],
    'Belgium': [50.5039, 4.4699],
    'Austria': [47.5162, 14.5501],
    'Spain': [40.4637, -3.7492],
    'Italy': [41.8719, 12.5674],
    'Poland': [51.9194, 19.1451],
    'Czech Republic': [49.8175, 15.4730],
    'Estonia': [58.5953, 25.0136],
    'Latvia': [56.8796, 24.6032],
    'Lithuania': [55.1694, 23.8813],
    'South Africa': [-30.5595, 22.9375],
    'Chile': [-35.6751, -71.5430],
    'Colombia': [4.5709, -74.2973],
    'Russia': [61.5240, 105.3188],
    'Ukraine': [48.3794, 31.1656],
    'Turkey': [38.9637, 35.2433],
    'UAE': [23.4241, 53.8478],
    'Saudi Arabia': [23.8859, 45.0792],
    'Egypt': [26.0975, 30.0444],
    'Morocco': [31.7917, -7.0926],
    'Kenya': [-0.0236, 37.9062],
    'Nigeria': [9.0820, 8.6753],
    'Ghana': [7.9465, -1.0232],
    'Thailand': [15.8700, 100.9925],
    'Vietnam': [14.0583, 108.2772],
    'Philippines': [12.8797, 121.7740],
    'Indonesia': [-0.7893, 113.9213],
    'Malaysia': [4.2105, 101.9758]
  };

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    if (this.countries && this.countries.length > 0) {
      this.addCountryMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    // Initialize the map
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20, 0], // Center of the world
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 1
    }).addTo(this.map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(45deg, #ef4444, #dc2626);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add CSS for marker animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  private addCountryMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    this.countries.forEach((country, index) => {
      const coordinates = this.getCountryCoordinates(country);
      if (coordinates) {
        const marker = L.marker(coordinates, {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background: linear-gradient(45deg, #0d9488, #0f766e);
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: bounce 2s infinite;
                animation-delay: ${index * 0.2}s;
              ">
                <div style="
                  color: white;
                  font-weight: bold;
                  font-size: 12px;
                ">${index + 1}</div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        }).addTo(this.map);

        // Add popup with country information
        marker.bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #0d9488; font-weight: bold; font-size: 16px;">
              ${country}
            </h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Rank #${index + 1} in hiring demand
            </p>
            <div style="margin-top: 8px; padding: 4px 8px; background: #f0fdfa; border-radius: 6px; color: #0d9488; font-size: 12px; font-weight: 500;">
              Active Hiring Market
            </div>
          </div>
        `, {
          closeButton: true,
          autoClose: false,
          className: 'custom-popup'
        });

        this.markers.push(marker);
      }
    });

    // Add bounce animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-8px); }
        60% { transform: translateY(-4px); }
      }
    `;
    document.head.appendChild(style);

    // Fit map to show all markers
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private getCountryCoordinates(country: string): [number, number] | null {
    // Try exact match first
    if (this.countryCoordinates[country]) {
      return this.countryCoordinates[country];
    }

    // Try case-insensitive match
    const lowerCountry = country.toLowerCase();
    for (const [key, value] of Object.entries(this.countryCoordinates)) {
      if (key.toLowerCase() === lowerCountry) {
        return value;
      }
    }

    // Try partial match
    for (const [key, value] of Object.entries(this.countryCoordinates)) {
      if (key.toLowerCase().includes(lowerCountry) || lowerCountry.includes(key.toLowerCase())) {
        return value;
      }
    }

    console.warn(`Coordinates not found for country: ${country}`);
    return null;
  }

  public focusOnCountry(country: string): void {
    const coordinates = this.getCountryCoordinates(country);
    if (coordinates && this.map) {
      this.map.setView(coordinates, 6);
      
      // Find and open the popup for this country
      const markerIndex = this.countries.indexOf(country);
      if (markerIndex >= 0 && this.markers[markerIndex]) {
        this.markers[markerIndex].openPopup();
      }
    }
  }
}
