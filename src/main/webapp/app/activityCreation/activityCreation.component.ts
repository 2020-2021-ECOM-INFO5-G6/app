import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LocalStorageService } from 'ngx-webstorage';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-activitycreation-modal',
  templateUrl: './activityCreation.component.html',
})
export class ActivityCreationComponent implements AfterViewInit {
  @ViewChild('name', { static: false })
  name?: ElementRef;

  authenticationError = false;

  createActivityForm = this.fb.group({
    name: [''],
  });

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private localStorage: LocalStorageService
  ) {}

  ngAfterViewInit(): void {
    if (this.name) {
      this.name.nativeElement.focus();
    }
  }

  cancel(): void {
    this.authenticationError = false;
    this.createActivityForm.patchValue({
      username: '',
      password: '',
    });
    this.activeModal.dismiss('cancel');
  }
}
