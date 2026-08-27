import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RawMaterialService, RawMaterial } from '../../../core/services/raw-material';

@Component({
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  template: `
    <div class="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in-up">
      
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/dashboard" class="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </a>
        <div>
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {{ isEditMode ? 'Edit Material' : 'New Raw Material' }}
          </h1>
          <p class="text-gray-400 mt-1">{{ isEditMode ? 'Update' : 'Define' }} constraints and rules appropriately.</p>
        </div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
         <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         {{ errorMsg }}
      </div>

      <div class="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <form [formGroup]="materialForm" (ngSubmit)="onSubmit()" class="relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            <div class="group">
              <label class="form-label">Material Name <span class="text-primary-500">*</span></label>
              <input type="text" formControlName="name" class="input-field" placeholder="e.g. Sodium Hyaluronate" />
              <div *ngIf="materialForm.get('name')?.touched && materialForm.get('name')?.invalid" class="text-red-400 text-xs mt-1">Required, Max 150 chars.</div>
            </div>
            
            <div class="group">
              <label class="form-label">Identifier Code <span class="text-primary-500">*</span></label>
              <input type="text" formControlName="code" class="input-field" placeholder="e.g. INCI-102" />
              <div *ngIf="materialForm.get('code')?.touched && materialForm.get('code')?.invalid" class="text-red-400 text-xs mt-1">Required unique formulation code.</div>
            </div>

            <div class="group">
              <label class="form-label">Category <span class="text-primary-500">*</span></label>
              <input type="text" formControlName="category" class="input-field" placeholder="e.g. Active Ingredient" />
              <div *ngIf="materialForm.get('category')?.touched && materialForm.get('category')?.invalid" class="text-red-400 text-xs mt-1">Required.</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="group">
                <label class="form-label">Quantity <span class="text-primary-500">*</span></label>
                <input type="number" formControlName="quantity" class="input-field" step="0.01" />
              </div>
              <div class="group">
                <label class="form-label">Unit <span class="text-primary-500">*</span></label>
                <select formControlName="unit_of_measure" class="input-field py-[13px] bg-surface-900 border-surface-700">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="l">Liters (L)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="pcs">Pieces</option>
                </select>
              </div>
            </div>
            <div *ngIf="materialForm.get('quantity')?.invalid" class="text-red-400 text-xs col-span-2 -mt-4">Quantity must be a positive number and unit is required.</div>
          </div>
          
          <div class="group mb-6">
            <label class="form-label">Lifecycle Status <span class="text-primary-500">*</span></label>
            <div class="flex gap-4">
               <label class="flex items-center gap-2 cursor-pointer p-4 bg-surface-900/50 rounded-xl border border-surface-700 flex-1 hover:border-primary-500/50 transition-colors" [class.ring-2]="materialForm.get('status')?.value === 'active'" [class.ring-primary-500]="materialForm.get('status')?.value === 'active'">
                 <input type="radio" formControlName="status" value="active" class="hidden" />
                 <span class="w-3 h-3 rounded-full bg-green-400"></span> Active Production
               </label>
               <label class="flex items-center gap-2 cursor-pointer p-4 bg-surface-900/50 rounded-xl border border-surface-700 flex-1 hover:border-primary-500/50 transition-colors" [class.ring-2]="materialForm.get('status')?.value === 'inactive'" [class.ring-primary-500]="materialForm.get('status')?.value === 'inactive'">
                 <input type="radio" formControlName="status" value="inactive" class="hidden" />
                 <span class="w-3 h-3 rounded-full bg-red-400"></span> Inactive Phase
               </label>
            </div>
          </div>

          <div class="group mb-8">
            <label class="form-label">Notes & Description</label>
            <textarea formControlName="description" rows="4" class="input-field resize-y" placeholder="Additional properties, origin, or storage bounds..."></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-surface-700">
             <a routerLink="/dashboard" class="btn-secondary">Cancel</a>
             <button type="submit" [disabled]="materialForm.invalid || isLoading" class="btn-primary min-w-[120px]">
               <span *ngIf="!isLoading">{{ isEditMode ? 'Save Changes' : 'Create Material' }}</span>
               <span *ngIf="isLoading" class="flex items-center gap-2">
                 <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Processing...
               </span>
             </button>
          </div>
        </form>
      </div>

    </div>
  `
})
export class RawMaterialForm implements OnInit {
  private fb = inject(FormBuilder);
  private rawMaterialService = inject(RawMaterialService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  materialId: number | null = null;
  isEditMode = false;
  isLoading = false;
  errorMsg = '';

  materialForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    code: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', Validators.required],
    unit_of_measure: ['kg', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    status: ['active', Validators.required],
    description: ['']
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.materialId = +id;
      this.loadMaterial();
    }
  }

  loadMaterial() {
    if (!this.materialId) return;
    this.rawMaterialService.getMaterial(this.materialId).subscribe({
      next: (material) => {
        this.materialForm.patchValue({
          name: material.name,
          code: material.code,
          category: material.category,
          unit_of_measure: material.unit_of_measure,
          quantity: material.quantity,
          status: material.status,
          description: material.description
        });
      },
      error: () => this.router.navigate(['/dashboard'])
    });
  }

  onSubmit() {
    if (this.materialForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';

    const payload = this.materialForm.getRawValue() as Partial<RawMaterial>;

    const request = this.isEditMode
      ? this.rawMaterialService.updateMaterial(this.materialId!, payload)
      : this.rawMaterialService.createMaterial(payload);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.error?.message || 'An error occurred. Check code/name uniqueness constraints.';
      }
    });
  }
}
