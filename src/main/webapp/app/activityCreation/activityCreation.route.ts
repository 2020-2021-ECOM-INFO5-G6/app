import { Route } from '@angular/router';

import { ActivityCreationComponent } from './activityCreation.component';
import { Authority } from 'app/shared/constants/authority.constants';

export const ACTIVITY_CREATION_ROUTE: Route = {
  path: 'activityCreation',
  component: ActivityCreationComponent,
  data: {
    authorities: [Authority.ADMIN],
    pageTitle: 'activityCreation.title',
  },
};
