import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { InstructorService } from 'app/entities/instructor/instructor.service';
import { UserService } from 'app/core/user/user.service';
import { ActivityService } from 'app/entities/activity/activity.service';
import { StudentService } from 'app/entities/student/student.service';
import { PricesService } from 'app/entities/prices/prices.service';

import { Instructor } from 'app/shared/model/instructor.model';
import { User } from 'app/core/user/user.model';
import { Activity } from 'app/shared/model/activity.model';
import { saveAs } from 'file-saver';
import { Prices } from 'app/shared/model/prices.model';

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

  prices: Prices | null = null;

  activities: Activity[] = [];

  raw: string | null = null;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private instructorService: InstructorService,
    private activityService: ActivityService,
    private studentService: StudentService,
    private pricesService: PricesService
  ) {}

  ngOnInit(): void {
    this.account = null;
    this.user = null;
    this.instructor = null;
    this.prices = null;
    this.activities = [];
    this.raw = null;
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
      this.getCurrentUserAsynchronously();
      this.getPricesAsynchronously();
      this.getActivitiesAsynchronously();
    } else {
      this.getCurrentInstructorAsynchronously();
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

  getPricesAsynchronously(): void {
    this.pricesService.query().subscribe(allPrices => {
      if (allPrices === null || allPrices.body?.length === 0) {
        this.prices = { id: 1, noted: 20, nonNoted: 50 };
        this.pricesService.create(this.prices).subscribe();
      } else {
        if (allPrices.body != null) {
          this.prices = allPrices.body[0];
        }
      }
    });
  }

  getActivitiesAsynchronously(): void {
    this.activityService.query().subscribe(activities => {
      if (activities != null) {
        if (activities.body != null) {
          this.activities = activities.body;
        } else {
          this.activities = [];
        }
      } else {
        this.activities = [];
      }
    });
  }

  getInstructorActivitiesAsynchronously(): void {
    this.activityService.query().subscribe(activities => {
      if (activities != null) {
        if (activities.body != null) {
          this.activities = activities.body;
        } else {
          this.activities = [];
        }
      } else {
        this.activities = [];
      }
    });
  }

  downloadContent(id: number, name: string): void {
    this.activityService.download(id).subscribe(content => {
      if (content != null && content.body != null) {
        saveAs(new Blob([content.body.replace(/\n/g, '\r\n')]), name + '-inscrits.csv');
      }
    });
  }

  downloadAllContent(): void {
    this.studentService.download().subscribe(content => {
      if (content != null && content.body != null) {
        saveAs(new File([content.body.replace(/\n/g, '\r\n')], 'tous-les-inscrits.csv'));
      }
    });
  }
}
