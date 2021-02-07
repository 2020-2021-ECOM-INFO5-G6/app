import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcomSharedModule } from 'app/shared/shared.module';
import { GDPR_ROUTE } from './GDPR.route';
import { GDPRComponent } from './GDPR.component';

@NgModule({
  imports: [EcomSharedModule, RouterModule.forChild([GDPR_ROUTE])],
  declarations: [GDPRComponent],
})
export class GDPRModule {}
