import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcomSharedModule } from 'app/shared/shared.module';
import { ACTIVITY_CREATION_ROUTE } from './activityCreation.route';
import { ActivityCreationComponent } from './activityCreation.component';

@NgModule({
  imports: [EcomSharedModule, ActivityCreationComponent, RouterModule.forChild([ACTIVITY_CREATION_ROUTE])],
  entryComponents: [ActivityCreationComponent],
  declarations: [ActivityCreationComponent],
  exports: [EcomSharedModule],
})
export class EcomActivityCreationModule {}
