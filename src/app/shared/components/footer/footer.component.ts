import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <mat-icon class="text-primary-400 text-2xl">psychology</mat-icon>
              <span class="text-xl font-bold">AI Career Navigator</span>
            </div>
            <p class="text-gray-300 mb-6 max-w-md">
              Empowering your career journey with AI-powered guidance, personalized recommendations, 
              and comprehensive learning roadmaps.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <mat-icon>linkedin</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
                <mat-icon>instagram</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/dashboard" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a routerLink="/career-guidance" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Career Guidance
                </a>
              </li>
              <li>
                <a routerLink="/history" class="text-gray-300 hover:text-primary-400 transition-colors">
                  History
                </a>
              </li>
              <li>
                <a routerLink="/profile" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Support</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter Subscription -->
        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="mb-4 md:mb-0">
              <h3 class="text-lg font-semibold mb-2">Stay Updated</h3>
              <p class="text-gray-300">Get the latest career insights and platform updates.</p>
            </div>
            <div class="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                class="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400">
              <button class="bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-r-lg transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} AI Career Navigator. All rights reserved.
          </p>
          <div class="flex items-center space-x-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
              Privacy
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
              Terms
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-400 transition-colors">
              Cookies
            </a>
            <span class="text-gray-400">
              Made with ❤️ for your career success
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }

    .mat-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    input:focus {
      outline: none;
    }

    @media (max-width: 768px) {
      .grid {
        gap: 2rem;
      }
      
      .flex {
        flex-direction: column;
        align-items: stretch;
      }
      
      .flex input {
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
      }
      
      .flex button {
        border-radius: 0.5rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
