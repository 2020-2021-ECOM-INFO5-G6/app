import { Route } from '@angular/router';

import { HomeInstructorComponent } from './homeInstructor.component';
import { Authority } from 'app/shared/constants/authority.constants';

export const HOME_INSTRUCTOR_ROUTE: Route = {
  path: 'homeInstructor',
  component: HomeInstructorComponent,
  data: {
    authorities: [Authority.ADMIN, Authority.INSTRUCTOR],
    pageTitle: 'homeInstructor.title',
  },
};
