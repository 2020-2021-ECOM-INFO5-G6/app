import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { StudentActivity } from 'app/shared/model/student-activity.model';
import { Student } from 'app/shared/model/student.model';
import { StudentService } from 'app/entities/student/student.service';
import { StudentActivityService } from 'app/entities/student-activity/student-activity.service';
import { UserService } from 'app/core/user/user.service';

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

  constructor(
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private studentService: StudentService,
    private studentActivityService: StudentActivityService
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
}
