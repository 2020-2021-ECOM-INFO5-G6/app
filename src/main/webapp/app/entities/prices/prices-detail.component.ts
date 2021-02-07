import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrices } from 'app/shared/model/prices.model';

@Component({
  selector: 'jhi-prices-detail',
  templateUrl: './prices-detail.component.html',
})
export class PricesDetailComponent implements OnInit {
  prices: IPrices | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prices }) => (this.prices = prices));
  }

  previousState(): void {
    window.history.back();
  }
}
