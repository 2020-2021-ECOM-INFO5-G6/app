import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { StudentComponentsPage, StudentDeleteDialog, StudentUpdatePage } from './student.page-object';

const expect = chai.expect;

describe('Student e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let studentComponentsPage: StudentComponentsPage;
  let studentUpdatePage: StudentUpdatePage;
  let studentDeleteDialog: StudentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Students', async () => {
    await navBarPage.goToEntity('student');
    studentComponentsPage = new StudentComponentsPage();
    await browser.wait(ec.visibilityOf(studentComponentsPage.title), 5000);
    expect(await studentComponentsPage.getTitle()).to.eq('ecomApp.student.home.title');
    await browser.wait(ec.or(ec.visibilityOf(studentComponentsPage.entities), ec.visibilityOf(studentComponentsPage.noResult)), 1000);
  });

  it('should load create Student page', async () => {
    await studentComponentsPage.clickOnCreateButton();
    studentUpdatePage = new StudentUpdatePage();
    expect(await studentUpdatePage.getPageTitle()).to.eq('ecomApp.student.home.createOrEditLabel');
    await studentUpdatePage.cancel();
  });

  it('should create and save Students', async () => {
    const nbButtonsBeforeCreate = await studentComponentsPage.countDeleteButtons();

    await studentComponentsPage.clickOnCreateButton();

    await promise.all([
      studentUpdatePage.sportLevelSelectLastOption(),
      studentUpdatePage.meetingPlaceSelectLastOption(),
      studentUpdatePage.internalUserSelectLastOption(),
      studentUpdatePage.cursusSelectLastOption(),
    ]);

    const selectedDrivingLicence = studentUpdatePage.getDrivingLicenceInput();
    if (await selectedDrivingLicence.isSelected()) {
      await studentUpdatePage.getDrivingLicenceInput().click();
      expect(await studentUpdatePage.getDrivingLicenceInput().isSelected(), 'Expected drivingLicence not to be selected').to.be.false;
    } else {
      await studentUpdatePage.getDrivingLicenceInput().click();
      expect(await studentUpdatePage.getDrivingLicenceInput().isSelected(), 'Expected drivingLicence to be selected').to.be.true;
    }

    await studentUpdatePage.save();
    expect(await studentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await studentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Student', async () => {
    const nbButtonsBeforeDelete = await studentComponentsPage.countDeleteButtons();
    await studentComponentsPage.clickOnLastDeleteButton();

    studentDeleteDialog = new StudentDeleteDialog();
    expect(await studentDeleteDialog.getDialogTitle()).to.eq('ecomApp.student.delete.question');
    await studentDeleteDialog.clickOnConfirmButton();

    expect(await studentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
