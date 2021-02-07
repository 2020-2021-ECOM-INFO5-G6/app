import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMaterial, Material } from 'app/shared/model/material.model';
import { MaterialService } from './material.service';
import { MaterialComponent } from './material.component';
import { MaterialDetailComponent } from './material-detail.component';
import { MaterialUpdateComponent } from './material-update.component';

@Injectable({ providedIn: 'root' })
export class MaterialResolve implements Resolve<IMaterial> {
  constructor(private service: MaterialService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMaterial> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((material: HttpResponse<Material>) => {
          if (material.body) {
            return of(material.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Material());
  }
}

export const materialRoute: Routes = [
  {
    path: '',
    component: MaterialComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.material.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MaterialDetailComponent,
    resolve: {
      material: MaterialResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.material.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MaterialUpdateComponent,
    resolve: {
      material: MaterialResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.material.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MaterialUpdateComponent,
    resolve: {
      material: MaterialResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'ecomApp.material.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
