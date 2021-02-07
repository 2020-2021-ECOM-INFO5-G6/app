import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISemesterInscription, SemesterInscription } from 'app/shared/model/semester-inscription.model';
import { SemesterInscriptionService } from './semester-inscription.service';
import { SemesterInscriptionComponent } from './semester-inscription.component';
import { SemesterInscriptionDetailComponent } from './semester-inscription-detail.component';
import { SemesterInscriptionUpdateComponent } from './semester-inscription-update.component';

@Injectable({ providedIn: 'root' })
export class SemesterInscriptionResolve implements Resolve<ISemesterInscription> {
  constructor(private service: SemesterInscriptionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISemesterInscription> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((semesterInscription: HttpResponse<SemesterInscription>) => {
          if (semesterInscription.body) {
            return of(semesterInscription.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SemesterInscription());
  }
}

export const semesterInscriptionRoute: Routes = [
  {
    path: '',
    component: SemesterInscriptionComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.semesterInscription.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SemesterInscriptionDetailComponent,
    resolve: {
      semesterInscription: SemesterInscriptionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.semesterInscription.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SemesterInscriptionUpdateComponent,
    resolve: {
      semesterInscription: SemesterInscriptionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.semesterInscription.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SemesterInscriptionUpdateComponent,
    resolve: {
      semesterInscription: SemesterInscriptionResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.semesterInscription.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
