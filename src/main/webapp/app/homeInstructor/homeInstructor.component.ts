import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { InstructorService } from 'app/entities/instructor/instructor.service';
import { UserService } from 'app/core/user/user.service';
import { ActivityService } from 'app/entities/activity/activity.service';

import { Instructor } from 'app/shared/model/instructor.model';
import { User } from 'app/core/user/user.model';
import { Activity } from 'app/shared/model/activity.model';
import { saveAs } from 'file-saver';

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
    private userService: UserService,
    private localStorage: LocalStorageService,
    private instructorService: InstructorService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => this.getLinkedEntity(account));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getLinkedEntity(account: Account | null): void {
    this.account = account;
    if (this.isAuthenticated() && this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.user = this.getCurrentUser();
      if (this.user == null) {
        this.getCurrentUserAsynchronously();
      }
    } else {
      this.instructor = this.getCurrentUser();
      if (this.instructor == null) {
        this.getCurrentInstructorAsynchronously();
      }
    }
  }

  getCurrentUser(): Instructor | User | null {
    this.raw = localStorage.getItem('currentUser');
    if (this.raw != null) {
      return JSON.parse(this.raw);
    }
    return null;
  }

  getCurrentUserAsynchronously(): void {
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.user = user;
      });
    }
  }

  getCurrentInstructorAsynchronously(): void {
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.instructorService.findbyuser(user.id).subscribe(instructor => {
          this.instructor = instructor.body;
        });
      });
    }
  }

  downloadContent(id: number): void {
    this.activityService.download(id).subscribe(string => {
      const blob = new Blob([string], { type: 'text/plain;charset=utf-8' });
      saveAs(blob);
    });
  }
}
