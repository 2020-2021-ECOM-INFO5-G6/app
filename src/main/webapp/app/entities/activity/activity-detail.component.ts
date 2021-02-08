import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IActivity } from 'app/shared/model/activity.model';
import { IInstructor } from 'app/shared/model/instructor.model';

import { AccountService } from 'app/core/auth/account.service';
import { InstructorService } from '../instructor/instructor.service';
import { UserService } from 'app/core/user/user.service';

import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-activity-detail',
  templateUrl: './activity-detail.component.html',
})
export class ActivityDetailComponent implements OnInit {
  activity: IActivity | null = null;
  account: Account | null = null;
  instructor: IInstructor | null = null;

  authSubscription?: Subscription;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected instructorService: InstructorService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activity }) => (this.activity = activity));

    // get instructor and check permission
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.getLinkedEntity(account);
    });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  getLinkedEntity(account: Account | null): void {
    this.account = account;
    if (this.isAuthenticated() && this.accountService.hasAnyAuthority('ROLE_INSTRUCTOR')) {
      this.getCurrentInstructorAsynchronously();
    }
  }

  getCurrentInstructorAsynchronously(): void {
    // get instructor and check permission
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.instructorService.findbyuser(user.id).subscribe(instructor => {
          // set this.instructor
          this.instructor = instructor.body;
          // check if the instructor have the current activty in his editable activities list
          this.instructorHaveActivity();
        });
      });
    }
  }

  instructorHaveActivity(): void {
    let haveActivity = false; // flag

    if (this.instructor !== null) {
      if (this.instructor.participateActivities !== undefined)
        for (const a of this.instructor.participateActivities)
          if (this.activity !== null) if (a.id === this.activity.id) haveActivity = true; // instructor have the current activity in his list

      if (this.instructor.editableActivities !== undefined)
        for (const a of this.instructor.editableActivities) if (this.activity !== null) if (a.id === this.activity.id) haveActivity = true; // instructor have the current activity in his list
    }

    if (!haveActivity) this.router.navigate(['/homeInstructor']);
  }

  previousState(): void {
    window.history.back();
  }
}
