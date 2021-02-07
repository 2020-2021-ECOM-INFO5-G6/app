import { Route } from '@angular/router';

import { GDPRComponent } from './GDPR.component';

export const GDPR_ROUTE: Route = {
  path: 'gdpr',
  component: GDPRComponent,
  data: {
    authorities: [],
    pageTitle: 'GDPR.title',
  },
};
