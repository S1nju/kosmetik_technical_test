import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RawMaterialService, RawMaterial, PaginatedResponse } from '../../../core/services/raw-material';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule, CommonModule],
  template: `
    <div class="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Inventory Dashboard</h1>
          <p class="text-slate-500 mt-1">Manage cosmetic raw materials</p>
        </div>
        <div class="flex gap-4">
          <button (click)="logout()" class="btn-secondary text-sm">Sign Out</button>
          <a routerLink="/raw-materials/new" class="btn-primary select-none flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Add Material
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-panel rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="form-label text-xs">Search by Name</label>
          <input type="text" [(ngModel)]="filters.name" class="input-field py-2 text-sm" placeholder="e.g. Water" />
        </div>
        <div>
          <label class="form-label text-xs">Category</label>
          <input type="text" [(ngModel)]="filters.category" class="input-field py-2 text-sm" placeholder="e.g. Solvent" />
        </div>
        <div>
          <label class="form-label text-xs">Status</label>
          <select [(ngModel)]="filters.status" class="input-field py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="flex items-center justify-between">
          <button (click)="applyFilters()" class="btn-primary py-2 px-4 shadow-sm w-full md:w-auto text-sm">
             <span class="flex items-center gap-2 justify-center">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               Search
             </span>
          </button>
          <span *ngIf="meta" class="text-xs text-slate-500 ml-4 hidden md:block">Total: {{ meta.totalItems }}</span>
        </div>
      </div>

      <!-- Table -->
      <div class="glass-panel overflow-hidden rounded-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-surface-700/30 text-xs text-slate-500 uppercase tracking-wider border-b border-surface-700">
              <tr>
                <th class="px-6 py-4 font-medium">Code & Name</th>
                <th class="px-6 py-4 font-medium">Category</th>
                <th class="px-6 py-4 font-medium">Quantity</th>
                <th class="px-6 py-4 font-medium">Status</th>
                <th class="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-700">
              <tr *ngIf="isLoading">
                 <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading components...</td>
              </tr>
              <tr *ngIf="!isLoading && materials.length === 0">
                 <td colspan="5" class="px-6 py-8 text-center text-slate-500">No raw materials found matching filters.</td>
              </tr>
              <tr *ngFor="let item of materials" class="hover:bg-surface-700/20 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">{{ item.name }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">{{ item.code }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">{{ item.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-700">
                  {{ item.quantity }} <span class="text-xs text-slate-500">{{ item.unit_of_measure }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5" [ngClass]="item.status === 'active' ? 'text-emerald-600' : 'text-red-600'">
                    <span class="w-2 h-2 rounded-full" [ngClass]="item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ item.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <a [routerLink]="['/raw-materials/edit', item.id]" class="text-primary-600 hover:text-primary-700 transition-colors mr-4 font-medium px-2 py-1 rounded bg-primary-50">Edit</a>
                  <button (click)="deleteItem(item)" class="text-red-600 hover:text-red-700 transition-colors font-medium px-2 py-1 rounded bg-red-50">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-surface-700 flex items-center justify-between bg-surface-900/40" *ngIf="meta && meta.totalPages > 1">
          <button [disabled]="meta.currentPage === 1" (click)="loadPage(meta.currentPage - 1)" class="btn-secondary text-xs px-4 py-1.5">Previous</button>
          <span class="text-xs text-slate-500">Page {{ meta.currentPage }} of {{ meta.totalPages }}</span>
          <button [disabled]="meta.currentPage === meta.totalPages" (click)="loadPage(meta.currentPage + 1)" class="btn-secondary text-xs px-4 py-1.5">Next</button>
        </div>
      </div>
    </div>
  `
})
export class Dashboard implements OnInit {
  private rawMaterialService = inject(RawMaterialService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  materials: RawMaterial[] = [];
  meta: PaginatedResponse<RawMaterial>['meta'] | null = null;
  isLoading = true;
  
  filters = {
    name: '',
    category: '',
    status: ''
  };

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.rawMaterialService.getMaterials(page, 10, this.filters).subscribe({
      next: (res) => {
        this.materials = res.data;
        this.meta = res.meta;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters() {
    this.loadPage(1);
  }

  deleteItem(item: RawMaterial) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.rawMaterialService.deleteMaterial(item.id).subscribe(() => {
        this.loadPage(this.meta?.currentPage || 1);
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
