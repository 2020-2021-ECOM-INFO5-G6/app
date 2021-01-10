import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ActivityComponentsPage, ActivityDeleteDialog, ActivityUpdatePage } from './activity.page-object';

const expect = chai.expect;

describe('Activity e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let activityComponentsPage: ActivityComponentsPage;
  let activityUpdatePage: ActivityUpdatePage;
  let activityDeleteDialog: ActivityDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Activities', async () => {
    await navBarPage.goToEntity('activity');
    activityComponentsPage = new ActivityComponentsPage();
    await browser.wait(ec.visibilityOf(activityComponentsPage.title), 5000);
    expect(await activityComponentsPage.getTitle()).to.eq('ecomApp.activity.home.title');
    await browser.wait(ec.or(ec.visibilityOf(activityComponentsPage.entities), ec.visibilityOf(activityComponentsPage.noResult)), 1000);
  });

  it('should load create Activity page', async () => {
    await activityComponentsPage.clickOnCreateButton();
    activityUpdatePage = new ActivityUpdatePage();
    expect(await activityUpdatePage.getPageTitle()).to.eq('ecomApp.activity.home.createOrEditLabel');
    await activityUpdatePage.cancel();
  });

  it('should create and save Activities', async () => {
    const nbButtonsBeforeCreate = await activityComponentsPage.countDeleteButtons();

    await activityComponentsPage.clickOnCreateButton();

    await promise.all([
      activityUpdatePage.setNameInput('name'),
      activityUpdatePage.setDateInput('2000-12-31'),
      activityUpdatePage.setPlaceInput('place'),
      activityUpdatePage.setCapacityInput('5'),
      activityUpdatePage.setCoeffInput('0.5'),
      activityUpdatePage.lakeSelectLastOption(),
    ]);

    expect(await activityUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await activityUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await activityUpdatePage.getPlaceInput()).to.eq('place', 'Expected Place value to be equals to place');
    expect(await activityUpdatePage.getCapacityInput()).to.eq('5', 'Expected capacity value to be equals to 5');
    const selectedInscriptionOpen = activityUpdatePage.getInscriptionOpenInput();
    if (await selectedInscriptionOpen.isSelected()) {
      await activityUpdatePage.getInscriptionOpenInput().click();
      expect(await activityUpdatePage.getInscriptionOpenInput().isSelected(), 'Expected inscriptionOpen not to be selected').to.be.false;
    } else {
      await activityUpdatePage.getInscriptionOpenInput().click();
      expect(await activityUpdatePage.getInscriptionOpenInput().isSelected(), 'Expected inscriptionOpen to be selected').to.be.true;
    }
    expect(await activityUpdatePage.getCoeffInput()).to.eq('0.5', 'Expected coeff value to be equals to 0.5');

    await activityUpdatePage.save();

    expect(await activityUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await activityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Activity', async () => {
    const nbButtonsBeforeDelete = await activityComponentsPage.countDeleteButtons();
    await activityComponentsPage.clickOnLastDeleteButton();

    activityDeleteDialog = new ActivityDeleteDialog();
    expect(await activityDeleteDialog.getDialogTitle()).to.eq('ecomApp.activity.delete.question');
    await activityDeleteDialog.clickOnConfirmButton();

    expect(await activityComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
