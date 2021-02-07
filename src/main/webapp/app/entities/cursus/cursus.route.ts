import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICursus, Cursus } from 'app/shared/model/cursus.model';
import { CursusService } from './cursus.service';
import { CursusComponent } from './cursus.component';
import { CursusDetailComponent } from './cursus-detail.component';
import { CursusUpdateComponent } from './cursus-update.component';

@Injectable({ providedIn: 'root' })
export class CursusResolve implements Resolve<ICursus> {
  constructor(private service: CursusService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICursus> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((cursus: HttpResponse<Cursus>) => {
          if (cursus.body) {
            return of(cursus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cursus());
  }
}

export const cursusRoute: Routes = [
  {
    path: '',
    component: CursusComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.cursus.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CursusDetailComponent,
    resolve: {
      cursus: CursusResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.cursus.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CursusUpdateComponent,
    resolve: {
      cursus: CursusResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.cursus.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CursusUpdateComponent,
    resolve: {
      cursus: CursusResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.cursus.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
