import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

import { EcomSharedModule } from 'app/shared/shared.module';
import { ACTIVITY_CREATION_ROUTE } from './activityCreation.route';
import { ActivityCreationComponent } from './activityCreation.component';

@NgModule({
  imports: [FormGroup, ReactiveFormsModule, EcomSharedModule, RouterModule.forChild([ACTIVITY_CREATION_ROUTE])],
  declarations: [ActivityCreationComponent],
  exports: [EcomSharedModule, ReactiveFormsModule, ActivityCreationComponent],
  bootstrap: [ActivityCreationComponent],
})
export class EcomActivityCreationModule {}
