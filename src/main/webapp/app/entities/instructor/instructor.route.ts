import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IInstructor, Instructor } from 'app/shared/model/instructor.model';
import { InstructorService } from './instructor.service';
import { InstructorComponent } from './instructor.component';
import { InstructorDetailComponent } from './instructor-detail.component';
import { InstructorUpdateComponent } from './instructor-update.component';

@Injectable({ providedIn: 'root' })
export class InstructorResolve implements Resolve<IInstructor> {
  constructor(private service: InstructorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInstructor> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((instructor: HttpResponse<Instructor>) => {
          if (instructor.body) {
            return of(instructor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Instructor());
  }
}

export const instructorRoute: Routes = [
  {
    path: '',
    component: InstructorComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.instructor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstructorDetailComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.instructor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstructorUpdateComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.instructor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstructorUpdateComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.instructor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
