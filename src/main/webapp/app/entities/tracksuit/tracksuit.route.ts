import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITracksuit, Tracksuit } from 'app/shared/model/tracksuit.model';
import { TracksuitService } from './tracksuit.service';
import { TracksuitComponent } from './tracksuit.component';
import { TracksuitDetailComponent } from './tracksuit-detail.component';
import { TracksuitUpdateComponent } from './tracksuit-update.component';

@Injectable({ providedIn: 'root' })
export class TracksuitResolve implements Resolve<ITracksuit> {
  constructor(private service: TracksuitService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITracksuit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((tracksuit: HttpResponse<Tracksuit>) => {
          if (tracksuit.body) {
            return of(tracksuit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tracksuit());
  }
}

export const tracksuitRoute: Routes = [
  {
    path: '',
    component: TracksuitComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.tracksuit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TracksuitDetailComponent,
    resolve: {
      tracksuit: TracksuitResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.tracksuit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TracksuitUpdateComponent,
    resolve: {
      tracksuit: TracksuitResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.tracksuit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TracksuitUpdateComponent,
    resolve: {
      tracksuit: TracksuitResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.tracksuit.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
