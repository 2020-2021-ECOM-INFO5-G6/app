import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ActivityCreationComponent } from './activityCreation.component';

@Injectable({ providedIn: 'root' })
export class ActivityCreationModalService {
  private isOpen = false;

  constructor(private modalService: NgbModal) {}

  open(): void {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef: NgbModalRef = this.modalService.open(ActivityCreationComponent);
    modalRef.result.finally(() => (this.isOpen = false));
  }
}
