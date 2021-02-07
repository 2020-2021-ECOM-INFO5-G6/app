import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrices } from 'app/shared/model/prices.model';
import { PricesService } from './prices.service';
import { PricesDeleteDialogComponent } from './prices-delete-dialog.component';

@Component({
  selector: 'jhi-prices',
  templateUrl: './prices.component.html',
})
export class PricesComponent implements OnInit, OnDestroy {
  prices?: IPrices[];
  eventSubscriber?: Subscription;

  constructor(protected pricesService: PricesService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.pricesService.query().subscribe((res: HttpResponse<IPrices[]>) => (this.prices = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPrices();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPrices): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPrices(): void {
    this.eventSubscriber = this.eventManager.subscribe('pricesListModification', () => this.loadAll());
  }

  delete(prices: IPrices): void {
    const modalRef = this.modalService.open(PricesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.prices = prices;
  }
}
