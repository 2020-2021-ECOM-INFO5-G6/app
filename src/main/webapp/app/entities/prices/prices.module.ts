import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcomSharedModule } from 'app/shared/shared.module';
import { PricesComponent } from './prices.component';
import { PricesDetailComponent } from './prices-detail.component';
import { PricesUpdateComponent } from './prices-update.component';
import { PricesDeleteDialogComponent } from './prices-delete-dialog.component';
import { pricesRoute } from './prices.route';

@NgModule({
  imports: [EcomSharedModule, RouterModule.forChild(pricesRoute)],
  declarations: [PricesComponent, PricesDetailComponent, PricesUpdateComponent, PricesDeleteDialogComponent],
  entryComponents: [PricesDeleteDialogComponent],
})
export class EcomPricesModule {}
