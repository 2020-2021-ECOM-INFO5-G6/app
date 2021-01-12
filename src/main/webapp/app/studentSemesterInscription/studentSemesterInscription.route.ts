import { Route } from '@angular/router';

import { StudentSemesterInscriptionComponent } from './studentSemesterInscription.component';

export const STUDENT_SEMESTER_INSCRIPTION_ROUTE: Route = {
  path: 'studentSemesterInscription',
  component: StudentSemesterInscriptionComponent,
  data: {
    authorities: [],
    pageTitle: 'studentSemesterInscription.title',
  },
};
