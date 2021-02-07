import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IStudentActivity, StudentActivity } from 'app/shared/model/student-activity.model';
import { StudentActivityService } from './student-activity.service';
import { StudentActivityComponent } from './student-activity.component';
import { StudentActivityDetailComponent } from './student-activity-detail.component';
import { StudentActivityUpdateComponent } from './student-activity-update.component';

@Injectable({ providedIn: 'root' })
export class StudentActivityResolve implements Resolve<IStudentActivity> {
  constructor(private service: StudentActivityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStudentActivity> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((studentActivity: HttpResponse<StudentActivity>) => {
          if (studentActivity.body) {
            return of(studentActivity.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StudentActivity());
  }
}

export const studentActivityRoute: Routes = [
  {
    path: '',
    component: StudentActivityComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.studentActivity.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentActivityDetailComponent,
    resolve: {
      studentActivity: StudentActivityResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.studentActivity.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentActivityUpdateComponent,
    resolve: {
      studentActivity: StudentActivityResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.studentActivity.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentActivityUpdateComponent,
    resolve: {
      studentActivity: StudentActivityResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.studentActivity.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
