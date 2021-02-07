import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';
import { IStudent } from 'app/shared/model/student.model';
import { SemesterInscription } from 'app/shared/model/semester-inscription.model';
import { SemesterInscriptionService } from 'app/entities/semester-inscription/semester-inscription.service';
import { PricesService } from 'app/entities/prices/prices.service';
import * as moment from 'moment';

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

  semesterPriceNoted = 0;
  semesterPriceNonNoted = 0;

  userjs: any;
  user: IStudent | null = null;

  START_DATE1 = '2021-09-03';
  END_DATE1 = '2021-12-18';

  START_DATE2 = '2022-01-06';
  END_DATE2 = '2022-06-13';

  isSubscribed1 = false;
  isSubscribed2 = false;

  // Student

  constructor(
    private accountService: AccountService,
    private router: Router,
    private loginService: LoginService,
    private semesterInscriptionService: SemesterInscriptionService,
    private pricesService: PricesService
  ) {}

  ngOnInit(): void {
    // JSON.parse(localStorage.getItem('currentUser'))
    this.userjs = localStorage.getItem('currentUser');
    this.user = this.userjs !== null ? JSON.parse(this.userjs) : null;
    /* console.log('User :');
    console.log(this.user);*/

    this.isAlreadySubscribed1();
    this.isAlreadySubscribed2();

    this.getSemesterPrices();
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
      const price = this.yes ? this.semesterPriceNoted : this.semesterPriceNonNoted;
      this.total += price;
    }

    // TODO: check if the semester inscription already exists
    // if it already exists then : this.alerte = true;

    // else then save the semester inscription
  }

  isAlreadySubscribed1(): void {
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student?.id === this.user?.id &&
          moment(insc.semester?.startDate).format('YYYY-MM-DD') === this.START_DATE1 &&
          moment(insc.semester?.endDate).format('YYYY-MM-DD') === this.END_DATE1
        ) {
          this.isSubscribed1 = true;
        }
      });
    });
  }

  isAlreadySubscribed2(): void {
    this.semesterInscriptionService.query().subscribe(array => {
      array.body?.forEach(insc => {
        if (
          insc.student?.id === this.user?.id &&
          moment(insc.semester?.startDate).format('YYYY-MM-DD') === this.START_DATE2 &&
          moment(insc.semester?.endDate).format('YYYY-MM-DD') === this.END_DATE2
        ) {
          console.log('here');
          this.isSubscribed2 = true;
        }
      });
    });
  }

  changeSubmited2(): void {
    this.submited2 = true;
    if (this.now2) {
      const price = this.yes2 ? this.semesterPriceNoted : this.semesterPriceNonNoted;
      this.total += price;
    }
  }

  onFinish(): void {
    if (this.submited) {
      this.subscribeS1();
    }
    if (this.submited2) {
      this.subscribeS2();
    }
    this.finish = true;
    this.router.navigate(['/homeStudent']);
  }

  subscribeS1(): void {
    console.log(this.user);
    this.semesterInscriptionService
      .createwithsemester(1, new SemesterInscription(undefined, this.yes, 20, undefined, this.now, this.user!, undefined))
      .subscribe(si => {
        this.user?.semesterInscriptions ? this.user.semesterInscriptions.push(si.body!) : (this.user!.semesterInscriptions = [si.body!]);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
      });
  }

  subscribeS2(): void {
    this.semesterInscriptionService
      .createwithsemester(2, new SemesterInscription(undefined, this.yes2, 20, undefined, this.now2, this.user!, undefined))
      .subscribe(si => {
        this.user?.semesterInscriptions ? this.user.semesterInscriptions.push(si.body!) : (this.user!.semesterInscriptions = [si.body!]);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
      });
  }

  getSemesterPrices(): void {
    this.pricesService.find(1).subscribe(price => {
      this.semesterPriceNoted = price.body?.noted!;
      this.semesterPriceNonNoted = price.body?.nonNoted!;
    });
  }

  getUserame(): string {
    if (this.user != null)
      if (this.user.internalUser !== undefined) if (this.user.internalUser.login !== undefined) return this.user.internalUser.login;
    return 'jpp';
  }
}
