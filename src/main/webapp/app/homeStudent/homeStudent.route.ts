import { Route } from '@angular/router';

import { HomeStudentComponent } from './homeStudent.component';
import { Authority } from 'app/shared/constants/authority.constants';

export const HOME_STUDENT_ROUTE: Route = {
  path: 'homeStudent',
  component: HomeStudentComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'homeStudent.title',
  },
};
