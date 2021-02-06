import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'student',
        loadChildren: () => import('./student/student.module').then(m => m.EcomStudentModule),
      },
      {
        path: 'instructor',
        loadChildren: () => import('./instructor/instructor.module').then(m => m.EcomInstructorModule),
      },
      {
        path: 'activity',
        loadChildren: () => import('./activity/activity.module').then(m => m.EcomActivityModule),
      },
      {
        path: 'student-activity',
        loadChildren: () => import('./student-activity/student-activity.module').then(m => m.EcomStudentActivityModule),
      },
      {
        path: 'cursus',
        loadChildren: () => import('./cursus/cursus.module').then(m => m.EcomCursusModule),
      },
      {
        path: 'semester-inscription',
        loadChildren: () => import('./semester-inscription/semester-inscription.module').then(m => m.EcomSemesterInscriptionModule),
      },
      {
        path: 'semester',
        loadChildren: () => import('./semester/semester.module').then(m => m.EcomSemesterModule),
      },
      {
        path: 'material',
        loadChildren: () => import('./material/material.module').then(m => m.EcomMaterialModule),
      },
      {
        path: 'tracksuit',
        loadChildren: () => import('./tracksuit/tracksuit.module').then(m => m.EcomTracksuitModule),
      },
      {
        path: 'board',
        loadChildren: () => import('./board/board.module').then(m => m.EcomBoardModule),
      },
      {
        path: 'sail',
        loadChildren: () => import('./sail/sail.module').then(m => m.EcomSailModule),
      },
      {
        path: 'prices',
        loadChildren: () => import('./prices/prices.module').then(m => m.EcomPricesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EcomEntityModule {}
