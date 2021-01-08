import { Route } from '@angular/router';

import { ActivityCreationComponent } from './activityCreation.component';

export const ACTIVITY_CREATION_ROUTE: Route = {
  path: 'activityCreation',
  component: ActivityCreationComponent,
  data: {
    authorities: [],
    pageTitle: 'homeInstructor.title',
  },
};
