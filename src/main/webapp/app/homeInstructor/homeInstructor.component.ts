import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { InstructorService } from 'app/entities/instructor/instructor.service';

import { Instructor } from 'app/shared/model/instructor.model';
import { User } from 'app/core/user/user.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './homeInstructor.component.html',
  styleUrls: ['homeInstructor.scss'],
})
export class HomeInstructorComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  user: User | null = null;
  instructor: Instructor | null = null;

  raw: string | null = null;

  constructor(
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => this.getLinkedStudent(account));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getLinkedStudent(account: Account | null): void {
    this.account = account;
    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.user = this.getCurrentUser();
    } else {
      this.instructor = this.getCurrentUser();
    }
  }

  getCurrentUser(): Instructor | User | null {
    this.raw = localStorage.getItem('currentUser');
    if (this.raw != null) {
      return JSON.parse(this.raw);
    }
    return null;
  }
}
