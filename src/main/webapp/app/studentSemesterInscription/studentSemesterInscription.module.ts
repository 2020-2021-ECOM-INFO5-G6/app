import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EcomSharedModule } from 'app/shared/shared.module';

import { STUDENT_SEMESTER_INSCRIPTION_ROUTE } from './studentSemesterInscription.route';
import { StudentSemesterInscriptionComponent } from './studentSemesterInscription.component';

@NgModule({
  imports: [CommonModule, EcomSharedModule, RouterModule.forChild([STUDENT_SEMESTER_INSCRIPTION_ROUTE])],
  declarations: [StudentSemesterInscriptionComponent],
  exports: [StudentSemesterInscriptionComponent],
})
export class EcomStudentSemesterInscriptionModule {}
