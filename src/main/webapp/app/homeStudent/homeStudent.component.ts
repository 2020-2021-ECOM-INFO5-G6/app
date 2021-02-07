import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { StudentActivity } from 'app/shared/model/student-activity.model';
import { Student } from 'app/shared/model/student.model';
import { StudentService } from 'app/entities/student/student.service';
import { StudentActivityService } from 'app/entities/student-activity/student-activity.service';
import { SemesterInscriptionService } from 'app/entities/semester-inscription/semester-inscription.service';
import { UserService } from 'app/core/user/user.service';
import * as moment from 'moment';

import { Router } from '@angular/router';
import { LoginService } from 'app/core/login/login.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './homeStudent.component.html',
  styleUrls: ['homeStudent.scss'],
})
export class HomeStudentComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  student: Student | null = null;
  studentActivities: StudentActivity[] | null = null;

  raw: string | null = null;

  START_DATE1 = '2021-09-03';
  END_DATE1 = '2021-12-18';

  START_DATE2 = '2022-01-06';
  END_DATE2 = '2022-06-13';
  isSubscribed1 = false;
  isSubscribed2 = false;
  isLoaded1 = false;
  isLoaded2 = false;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private studentService: StudentService,
    private router: Router,
    private loginService: LoginService
    private studentActivityService: StudentActivityService,
    private semesterInscriptionService: SemesterInscriptionService
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
    this.getCurrentStudentAsynchronously();
  }

  getCurrentStudent(): Student | null {
    this.raw = localStorage.getItem('currentUser');
    if (this.raw != null) {
      const student: Student = JSON.parse(this.raw);
      this.getActivitiesOfStudentAsynchronously(student?.id?.valueOf());
      return student;
    }
    return null;
  }

  getCurrentStudentAsynchronously(): void {
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.studentService.findbyuser(user.id).subscribe(student => {
          this.student = student.body;
          this.getActivitiesOfStudentAsynchronously(this.student?.id?.valueOf());
          this.isAlreadySubscribed1();
          this.isAlreadySubscribed2();
        });
      });
    }
  }

  getActivitiesOfStudentAsynchronously(id: number | undefined): void {
    if (id) {
      this.studentActivityService.getfordefinedstudent(id).subscribe(studentActivities => {
        this.studentActivities = studentActivities.body;
      });
    }
  }

  isAlreadySubscribed1(): void {
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student?.id === this.student?.id &&
          moment(insc.semester?.startDate).format('YYYY-MM-DD') === this.START_DATE1 &&
          moment(insc.semester?.endDate).format('YYYY-MM-DD') === this.END_DATE1
        ) {
          this.isSubscribed1 = true;
        }
      });
    });
    this.isLoaded1 = true;
  }

  isAlreadySubscribed2(): void {
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student?.id === this.student?.id &&
          moment(insc.semester?.startDate).format('YYYY-MM-DD') === this.START_DATE2 &&
          moment(insc.semester?.endDate).format('YYYY-MM-DD') === this.END_DATE2
        ) {
          this.isSubscribed2 = true;
        }
      });
    });
    this.isLoaded2 = true;
  }

  getFirstName(): string {
    if (this.student !== null && this.student.internalUser !== undefined && this.student.internalUser.firstName !== undefined)
      return this.student.internalUser?.firstName;
    return '';
  }
}
