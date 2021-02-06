import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDateMomentAdapter } from 'app/shared/util/datepicker-adapter';

import { EcomSharedModule } from 'app/shared/shared.module';
import { ACTIVITY_CREATION_ROUTE } from './activityCreation.route';
import { ActivityCreationComponent } from './activityCreation.component';

@NgModule({
  providers: [NgbDateMomentAdapter],
  imports: [CommonModule, EcomSharedModule, RouterModule.forChild([ACTIVITY_CREATION_ROUTE])],
  declarations: [ActivityCreationComponent],
  exports: [ActivityCreationComponent],
})
export class EcomActivityCreationModule {}
