import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityCreationModalService } from 'app/activityCreation/activityCreation-modal.service';
import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

import { Instructor } from 'app/shared/model/instructor.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './homeInstructor.component.html',
  styleUrls: ['homeInstructor.scss'],
})
export class HomeInstructorComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  instructor: Instructor | null = null;

  constructor(
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private activityCreationModalService: ActivityCreationModalService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  createActivity(): void {
    this.activityCreationModalService.open();
  }

  // TODO : return current Instructor from local strorage
  getCurrentInstructor(): Instructor | null {
    // return localStorage.retrieve('currentUser');
    return null;
  }
}
