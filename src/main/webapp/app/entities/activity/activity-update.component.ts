import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { IActivity, Activity } from 'app/shared/model/activity.model';
import { ActivityService } from './activity.service';
import { StudentActivityService } from 'app/entities/student-activity/student-activity.service';
import { StudentService } from 'app/entities/student/student.service';
import { IStudent } from 'app/shared/model/student.model';

@Component({
  selector: 'jhi-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  isSaving = false;
  dateDp: any;

  students: IStudent[] | null = null;
  activity: IActivity | null = null;

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

  constructor(
    protected activityService: ActivityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private studentService: StudentService,
    private studentActivityService: StudentActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activity }) => {
      if (activity.id !== null) {
        this.studentService.getvalid(activity.id).subscribe(students => {
          this.students = students.body;
          console.log(this.students?.length);
          console.log(this.students);
        });
      }
      this.activity = activity;
      this.updateForm(activity);
    });
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
      this.router.navigate(['activity']);
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activity = this.createFromForm();
    if (activity.id !== undefined) {
      this.subscribeToSaveResponse(this.activityService.update(activity));
    } else {
      this.subscribeToSaveResponse(this.activityService.create(activity));
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
}
