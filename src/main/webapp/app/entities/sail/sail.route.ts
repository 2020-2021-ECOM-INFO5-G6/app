import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISail, Sail } from 'app/shared/model/sail.model';
import { SailService } from './sail.service';
import { SailComponent } from './sail.component';
import { SailDetailComponent } from './sail-detail.component';
import { SailUpdateComponent } from './sail-update.component';

@Injectable({ providedIn: 'root' })
export class SailResolve implements Resolve<ISail> {
  constructor(private service: SailService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISail> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((sail: HttpResponse<Sail>) => {
          if (sail.body) {
            return of(sail.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sail());
  }
}

export const sailRoute: Routes = [
  {
    path: '',
    component: SailComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.sail.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SailDetailComponent,
    resolve: {
      sail: SailResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.sail.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SailUpdateComponent,
    resolve: {
      sail: SailResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.sail.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SailUpdateComponent,
    resolve: {
      sail: SailResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.sail.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
