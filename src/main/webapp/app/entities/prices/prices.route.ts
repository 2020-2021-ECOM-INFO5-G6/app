import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPrices, Prices } from 'app/shared/model/prices.model';
import { PricesService } from './prices.service';
import { PricesComponent } from './prices.component';
import { PricesDetailComponent } from './prices-detail.component';
import { PricesUpdateComponent } from './prices-update.component';

@Injectable({ providedIn: 'root' })
export class PricesResolve implements Resolve<IPrices> {
  constructor(private service: PricesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrices> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((prices: HttpResponse<Prices>) => {
          if (prices.body) {
            return of(prices.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Prices());
  }
}

export const pricesRoute: Routes = [
  {
    path: '',
    component: PricesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.prices.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PricesDetailComponent,
    resolve: {
      prices: PricesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.prices.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PricesUpdateComponent,
    resolve: {
      prices: PricesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.prices.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PricesUpdateComponent,
    resolve: {
      prices: PricesResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'ecomApp.prices.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
