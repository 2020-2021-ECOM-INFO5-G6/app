import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EcomSharedModule } from 'app/shared/shared.module';
import { EcomCoreModule } from 'app/core/core.module';
import { EcomAppRoutingModule } from './app-routing.module';
// Homes
import { EcomHomeStudentModule } from './homeStudent/homeStudent.module';
import { EcomHomeInstructorModule } from './homeInstructor/homeInstructor.module';
// Student
import { EcomStudentSemesterInscriptionModule } from './studentSemesterInscription/studentSemesterInscription.module';
// Admin
import { EcomActivityCreationModule } from './activityCreation/activityCreation.module';
// Entities
import { EcomEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    EcomSharedModule,
    EcomCoreModule,
    // Homes
    EcomHomeStudentModule,
    EcomHomeInstructorModule,
    // Student
    EcomStudentSemesterInscriptionModule,
    // Admin
    EcomActivityCreationModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EcomEntityModule,
    EcomAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent],
})
export class EcomAppModule {}
