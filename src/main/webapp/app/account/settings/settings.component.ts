import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { LANGUAGES } from 'app/core/language/language.constants';

import { LocalStorageService } from 'ngx-webstorage';
import { StudentService } from 'app/entities/student/student.service';
import { InstructorService } from 'app/entities/instructor/instructor.service';
import { UserService } from 'app/core/user/user.service';
import { CursusService } from 'app/entities/cursus/cursus.service';

import { Student } from 'app/shared/model/student.model';
import { Instructor } from 'app/shared/model/instructor.model';
import { User } from 'app/core/user/user.model';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  account: Account | null = null;
  success = false;
  languages = LANGUAGES;

  student: Student | null = null;
  instructor: Instructor | null = null;
  user: User | null = null;

  raw: string | null = null;

  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined],
    cursusComposant: [],
    cursusLevel: [null, [Validators.min(0)]],
    sportLevel: [],
    drivingLicence: [],
    meetingPlace: [],
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private instructorService: InstructorService,
    private studentService: StudentService,
    private cursusService: CursusService
  ) {}

  ngOnInit(): void {
    this.student = null;
    this.instructor = null;
    this.user = null;

    this.accountService.identity().subscribe(account => {
      if (account != null) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey,
        });

        this.account = account;
      }
      this.getLinkedEntity(account);
    });
  }

  save(): void {
    this.success = false;

    if (this.account != null) {
      this.account.firstName = this.settingsForm.get('firstName')!.value;
      this.account.lastName = this.settingsForm.get('lastName')!.value;
      this.account.email = this.settingsForm.get('email')!.value;
      this.account.langKey = this.settingsForm.get('langKey')!.value;

      this.accountService.save(this.account).subscribe(() => {
        this.success = true;
        this.accountService.authenticate(this.account);

        if (this.account != null && this.account.langKey !== this.languageService.getCurrentLanguage()) {
          this.languageService.changeLanguage(this.account.langKey);
        }
      });
    }

    if (this.student != null) {
      if (this.student.cursus != null) {
        this.student.cursus.composant = this.settingsForm.get(['cursusComposant'])!.value;
        this.student.cursus.academicLevel = this.settingsForm.get(['cursusLevel'])!.value;
        this.cursusService.update(this.student.cursus).subscribe();
      }
      this.student.sportLevel = this.settingsForm.get(['sportLevel'])!.value;
      this.student.drivingLicence = this.settingsForm.get(['drivingLicence'])!.value;
      this.student.meetingPlace = this.settingsForm.get(['meetingPlace'])!.value;

      localStorage.setItem('currentUser', JSON.stringify(this.student));
      this.studentService.update(this.student).subscribe();
    }
  }

  getLinkedEntity(account: Account | null): void {
    this.account = account;
    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.getCurrentUserAsynchronously();
    } else if (this.accountService.hasAnyAuthority('ROLE_INSTRUCTOR')) {
      this.getCurrentInstructorAsynchronously();
    } else {
      this.getCurrentStudentAsynchronously();
    }
  }

  getCurrentUser(): Student | Instructor | User | null {
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

  getCurrentStudentAsynchronously(): void {
    if (this.account != null) {
      this.userService.find(this.account.login).subscribe(user => {
        this.studentService.findbyuser(user.id).subscribe(student => {
          this.student = student.body;
          if (this.student != null) {
            this.settingsForm.patchValue({
              cursusComposant: this.student.cursus?.composant,
              cursusLevel: this.student.cursus?.academicLevel,
              sportLevel: this.student.sportLevel,
              drivingLicence: this.student.drivingLicence,
              meetingPlace: this.student.meetingPlace,
            });
          }
        });
      });
    }
  }
}
