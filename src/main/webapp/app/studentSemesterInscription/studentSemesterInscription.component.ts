import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';
import { IStudent } from 'app/shared/model/student.model';
import { SemesterInscriptionService } from 'app/entities/semester-inscription/semester-inscription.service';
import { semesterInscriptionRoute } from 'app/entities/semester-inscription/semester-inscription.route';
import { Moment } from 'moment';

@Component({
  selector: 'jhi-home',
  templateUrl: './studentSemesterInscription.component.html',
  styleUrls: ['studentSemesterInscription.scss'],
})
export class StudentSemesterInscriptionComponent implements OnInit {
  isFirstSemester = false;
  isSecondSemester = false;

  yes = true;
  no = false;

  later = true;
  now = false;

  submited = false;
  alerte = false;

  yes2 = true;
  no2 = false;

  later2 = true;
  now2 = false;

  submited2 = false;
  alerte2 = false;

  finish = false;

  total = 0;

  semesterPrice = 35;

  userjs: any;
  user: IStudent | null = null;

  START_DATE1: Date = new Date('2021-09-03');
  END_DATE1: Date = new Date('2021-12-18');

  START_DATE2: Date = new Date('2022-01-06');
  END_DATE2: Date = new Date('2021-06-13');

  isSubscribed1: boolean = false;
  isSubscribed2: boolean = false;

  // Student

  constructor(
    private router: Router,
    private accountService: AccountService,
    private loginService: LoginService,
    private semesterInscriptionService: SemesterInscriptionService
  ) {}

  ngOnInit(): void {
    // Authentification control
    if (!this.accountService.isAuthenticated()) {
      // this.navbarComponent.logout();
      this.loginService.logout();
      this.router.navigate(['']);
    }

    // JSON.parse(localStorage.getItem('currentUser'))
    this.userjs = localStorage.getItem('currentUser');
    this.user = this.userjs !== null ? JSON.parse(this.userjs) : null;
    console.log('User :');
    console.log(this.user);

    this.isSubscribed1 = this.isAlreadySubscribed1();
    this.isSubscribed2 = this.isAlreadySubscribed2();
  }

  reset(): void {
    this.yes = true;
    this.no = false;

    this.later = true;
    this.now = false;

    this.submited = false;
    this.alerte = false;

    this.yes2 = true;
    this.no2 = false;

    this.later2 = true;
    this.now2 = false;

    this.submited2 = false;
    this.alerte2 = false;

    this.finish = false;

    this.total = 0;
  }

  changeValueOfFirstSemester(): void {
    this.isFirstSemester = !this.isFirstSemester;
  }

  changeValueOfSecondSemester(): void {
    this.isSecondSemester = !this.isSecondSemester;
  }

  changeNoted(): void {
    this.yes = !this.yes;
    this.no = !this.no;
  }

  changeNoted2(): void {
    this.yes2 = !this.yes2;
    this.no2 = !this.no2;
  }

  changePayement(): void {
    this.later = !this.later;
    this.now = !this.now;
  }

  changePayement2(): void {
    this.later2 = !this.later2;
    this.now2 = !this.now2;
  }

  changeSubmited(): void {
    this.submited = true;
    if (this.now) {
      this.total += this.semesterPrice;
    }

    //TODO: check if the semester inscription already exists
    // if it already exists then : this.alerte = true;

    // else then save the semester inscription
  }

  isAlreadySubscribed1(): boolean {
    let res = false;
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student === this.user &&
          insc.semester?.startDate?.toDate() === this.START_DATE1 &&
          insc.semester?.endDate?.toDate() === this.END_DATE1
        ) {
          res = true;
        }
      });
    });
    return res;
  }

  isAlreadySubscribed2(): boolean {
    let res = false;
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student === this.user &&
          insc.semester?.startDate?.toDate() === this.START_DATE2 &&
          insc.semester?.endDate?.toDate() === this.END_DATE2
        ) {
          res = true;
        }
      });
    });
    return res;
  }

  changeSubmited2(): void {
    this.submited2 = true;
    if (this.now2) {
      this.total += this.semesterPrice;
    }
  }

  onFinish(): void {
    this.finish = true;
  }

  getUserame(): string {
    if (this.user != null)
      if (this.user.internalUser !== undefined) if (this.user.internalUser.login !== undefined) return this.user.internalUser.login;
    return 'jpp';
  }
}
