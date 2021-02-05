import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPrices } from 'app/shared/model/prices.model';
import { PricesService } from './prices.service';

@Component({
  templateUrl: './prices-delete-dialog.component.html',
})
export class PricesDeleteDialogComponent {
  prices?: IPrices;

  constructor(protected pricesService: PricesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pricesService.delete(id).subscribe(() => {
      this.eventManager.broadcast('pricesListModification');
      this.activeModal.close();
    });
  }
}
