import { Route } from '@angular/router';

import { StudentSemesterInscriptionComponent } from './studentSemesterInscription.component';
import { Authority } from 'app/shared/constants/authority.constants';

export const STUDENT_SEMESTER_INSCRIPTION_ROUTE: Route = {
  path: 'studentSemesterInscription',
  component: StudentSemesterInscriptionComponent,
  data: {
    authorities: [Authority.USER],
    pageTitle: 'studentSemesterInscription.title',
  },
};
