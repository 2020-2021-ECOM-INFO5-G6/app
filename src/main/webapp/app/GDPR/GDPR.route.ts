import { Route } from '@angular/router';

import { GDPRComponent } from './GDPR.component';

export const GDPR_ROUTE: Route = {
  path: 'GDPR',
  component: GDPRComponent,
  data: {
    authorities: [],
    pageTitle: 'GDPR.title',
  },
};
