import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/core/login/login.service';
import { IInstructor, Instructor } from 'app/shared/model/instructor.model';
import { InstructorService } from '../entities/instructor/instructor.service';
import { HttpResponse } from '@angular/common/http';
import { IActivity, Activity } from 'app/shared/model/activity.model';
import { Lakes } from 'app/shared/model/enumerations/lakes.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../entities/activity/activity.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'jhi-home',
  templateUrl: './activityCreation.component.html',
  styleUrls: ['./activityCreation.scss'],
})
export class ActivityCreationComponent implements OnInit {
  isSaving = false;

  allInstructors?: IInstructor[];
  selectedInstructors: IInstructor[] = [];

  name = '';
  place = '';
  capacity = 0;
  isOpen = false;
  coeff = 0;
  lake: Lakes | undefined = undefined;
  open = false;
  submit = false;
  date = '';

  constructor(
    private router: Router,
    private accountService: AccountService,
    private loginService: LoginService,
    protected instructorService: InstructorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected activityService: ActivityService
  ) {}

  ngOnInit(): void {
    // Authentification control
    if (!this.accountService.isAuthenticated()) {
      // this.navbarComponent.logout();
      this.loginService.logout();
      this.router.navigate(['']);
    }
    this.loadInstructors();
  }

  loadInstructors(): void {
    this.instructorService.query().subscribe((res: HttpResponse<IInstructor[]>) => (this.allInstructors = res.body || []));
  }

  addInstructor(i: IInstructor): void {
    this.selectedInstructors?.push(i);
    const index = this.allInstructors?.indexOf(i);
    if (index !== undefined) this.allInstructors?.splice(index, 1);
  }

  removeInstructor(i: IInstructor): void {
    this.allInstructors?.push(i);
    const index = this.selectedInstructors?.indexOf(i);
    if (index !== undefined) this.selectedInstructors?.splice(index, 1);
  }

  onChangeName(event: any): void {
    this.name = event.target.value;
  }

  onChangeDate(event: any): void {
    this.date = event.target.value;
  }

  onChangePlace(event: any): void {
    this.place = event.target.value;
  }

  onChangeCapacity(event: any): void {
    this.capacity = event.target.value;
  }

  onChangeCoeff(event: any): void {
    this.coeff = event.target.value;
  }

  onChangeOpen(): void {
    this.open = !this.open;
  }

  select(event: any): void {
    this.lake = event.target.value;
  }

  getName(i: Instructor): string {
    if (i.internalUser?.firstName !== undefined && i.internalUser?.lastName !== undefined)
      return i.internalUser?.firstName + ' ' + i.internalUser?.lastName;
    return '';
  }

  onSubmit(): void {
    this.submit = true;
    this.isSaving = true;
    if (this.name !== '' && this.place !== '' && this.lake !== undefined && this.date !== '') {
      const activity = this.newActivity();
      console.log(activity);

      this.subscribeToSaveResponse(
        this.activityService.createwithinstructors(activity, this.selectedInstructors, this.selectedInstructors)
      );

      this.router.navigate(['/homeInstructor']);
    }
  }

  newActivity(): IActivity {
    return {
      ...new Activity(),
      name: this.name,
      date: moment(new Date(this.date)),
      place: this.place,
      capacity: this.capacity,
      inscriptionOpen: this.open,
      coeff: this.coeff,
      lake: this.lake,
      monitors: this.selectedInstructors,
      managers: [],
      studentActivities: [],
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivity>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    // this.previousState();
  }

  previousState(): void {
    window.history.back();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  reset(): void {
    this.name = '';
    this.place = '';
    this.capacity = 0;
    this.isOpen = false;
    this.coeff = 1;
    this.lake = undefined;
    this.submit = false;
    this.allInstructors = [];
    this.selectedInstructors = [];
    this.loadInstructors();
    this.date = '';
  }
}
