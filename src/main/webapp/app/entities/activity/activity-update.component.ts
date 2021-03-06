import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { IActivity, Activity } from 'app/shared/model/activity.model';
import { IInstructor, Instructor } from 'app/shared/model/instructor.model';
import { InstructorService } from '../instructor/instructor.service';
import { ActivityService } from './activity.service';
import { StudentActivityService } from 'app/entities/student-activity/student-activity.service';
import { StudentService } from 'app/entities/student/student.service';
import { IStudent } from 'app/shared/model/student.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  account: Account | null = null;
  instructor: IInstructor | null = null;

  isSaving = false;
  dateDp: any;

  students: IStudent[] | null = null;
  activity: IActivity | null = null;

  authSubscription?: Subscription;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    date: [null, [Validators.required]],
    place: [],
    capacity: [null, [Validators.min(0)]],
    inscriptionOpen: [null, [Validators.required]],
    coeff: [null, [Validators.min(0), Validators.max(1)]],
    lake: [],
  });

  materialForm = this.fb.group({
    comment: [],
  });

  allInstructors?: IInstructor[];
  selectedInstructors: IInstructor[] = [];
  constructor(
    protected activityService: ActivityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private studentService: StudentService,
    private studentActivityService: StudentActivityService,
    private router: Router,
    protected instructorService: InstructorService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Load activity
    this.activatedRoute.data.subscribe(({ activity }) => {
      if (activity.id !== null && activity.id !== undefined) {
        this.studentService.getvalid(activity.id).subscribe(students => {
          this.students = students.body;
        });
      }
      this.activity = activity;
      this.loadInstructors();
      this.updateForm(activity);
    });

    // In the case of update, check if the instructor have this activity in his editableactivity list
    if (this.editForm.get('id')!.value) {
      // if is update page
      this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
        this.getLinkedEntity(account); // get instructor and check permission
      });
    }
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

    if (this.instructor !== null)
      if (this.instructor.editableActivities !== undefined)
        for (const a of this.instructor.editableActivities) if (a.id === this.editForm.get('id')?.value) haveActivity = true; // instructor have the current activity in his list

    if (!haveActivity) this.router.navigate(['/homeInstructor']);
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  updateForm(activity: IActivity): void {
    this.editForm.patchValue({
      id: activity.id,
      name: activity.name,
      date: activity.date,
      place: activity.place,
      capacity: activity.capacity,
      inscriptionOpen: activity.inscriptionOpen,
      coeff: activity.coeff,
      lake: activity.lake,
    });
  }

  showPop(id: number): void {
    const x = document.getElementById('pop-' + id);

    if (x !== null) {
      if (x.style.display === 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }

  registerStudent(student: IStudent): void {
    if (student !== null && this.activity !== null) {
      this.studentActivityService.subscribestudent(student.id!, this.activity.id!, this.materialForm.get(['comment'])!.value).subscribe();
      if (this.isAuthenticated() && this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
        this.router.navigate(['activity']);
      } else {
        this.router.navigate(['homeInstructor']);
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activity = this.createFromForm();
    if (activity.id !== undefined && activity.id !== null) {
      this.subscribeToSaveResponse(
        this.activityService.updatewithinstructors(activity, this.selectedInstructors, this.selectedInstructors)
      );
    } else {
      //this.subscribeToSaveResponse(this.activityService.create(activity));
      this.subscribeToSaveResponse(
        this.activityService.createwithinstructors(activity, this.selectedInstructors, this.selectedInstructors)
      );
    }
  }

  trackId(index: number, item: IStudent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  private createFromForm(): IActivity {
    return {
      ...new Activity(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      date: this.editForm.get(['date'])!.value,
      place: this.editForm.get(['place'])!.value,
      capacity: this.editForm.get(['capacity'])!.value,
      inscriptionOpen: this.editForm.get(['inscriptionOpen'])!.value,
      coeff: this.editForm.get(['coeff'])!.value,
      lake: this.editForm.get(['lake'])!.value,
      monitors: this.selectedInstructors,
      managers: this.selectedInstructors,
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
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  loadInstructors(): void {
    //allInstructors
    this.instructorService.query().subscribe((res: HttpResponse<IInstructor[]>) => {
      this.allInstructors = res.body || [];

      if (this.allInstructors !== undefined)
        for (const i of this.allInstructors)
          if (i.editableActivities !== undefined)
            for (const a of i.editableActivities)
              if (this.activity !== undefined && this.activity !== null) if (a.id === this.activity.id) this.selectedInstructors?.push(i);

      if (this.selectedInstructors !== undefined)
        for (const i of this.selectedInstructors) {
          const index = this.allInstructors?.indexOf(i);
          if (index !== undefined) this.allInstructors?.splice(index, 1);
        }
    });
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

  getName(i: Instructor): string {
    if (i.internalUser?.firstName !== undefined && i.internalUser?.lastName !== undefined)
      return i.internalUser?.firstName + ' ' + i.internalUser?.lastName;
    return '';
  }
}
