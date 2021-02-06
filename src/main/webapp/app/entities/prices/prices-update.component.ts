import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPrices, Prices } from 'app/shared/model/prices.model';
import { PricesService } from './prices.service';

@Component({
  selector: 'jhi-prices-update',
  templateUrl: './prices-update.component.html',
})
export class PricesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    noted: [null, [Validators.required]],
    nonNoted: [null, [Validators.required]],
  });

  constructor(protected pricesService: PricesService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prices }) => {
      this.updateForm(prices);
    });
  }

  updateForm(prices: IPrices): void {
    this.editForm.patchValue({
      id: prices.id,
      noted: prices.noted,
      nonNoted: prices.nonNoted,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prices = this.createFromForm();
    if (prices.id !== undefined) {
      this.subscribeToSaveResponse(this.pricesService.update(prices));
    } else {
      this.subscribeToSaveResponse(this.pricesService.create(prices));
    }
  }

  private createFromForm(): IPrices {
    return {
      ...new Prices(),
      id: this.editForm.get(['id'])!.value,
      noted: this.editForm.get(['noted'])!.value,
      nonNoted: this.editForm.get(['nonNoted'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrices>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
