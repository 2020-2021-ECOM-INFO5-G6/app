import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { Student } from 'app/shared/model/student.model';
import { StudentService } from 'app/entities/student/student.service';
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

  raw: string | null = null;

  constructor(
    private accountService: AccountService,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private studentService: StudentService
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
    this.student = this.getCurrentStudent();
    if (this.student == null) {
      this.getCurrentStudentAsynchronously();
    }
  }

  getCurrentStudent(): Student | null {
    this.raw = localStorage.getItem('currentUser');
    if (this.raw != null) {
      return JSON.parse(this.raw);
    }
    return null;
  }

  getCurrentStudentAsynchronously(): void {
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.studentService.findbyuser(user.id).subscribe(student => {
          // eslint-disable-next-line no-console
          console.log(student);
          this.student = student.body;
        });
      });
    }
  }
}
