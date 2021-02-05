import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PricesComponentsPage, PricesDeleteDialog, PricesUpdatePage } from './prices.page-object';

const expect = chai.expect;

describe('Prices e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pricesComponentsPage: PricesComponentsPage;
  let pricesUpdatePage: PricesUpdatePage;
  let pricesDeleteDialog: PricesDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Prices', async () => {
    await navBarPage.goToEntity('prices');
    pricesComponentsPage = new PricesComponentsPage();
    await browser.wait(ec.visibilityOf(pricesComponentsPage.title), 5000);
    expect(await pricesComponentsPage.getTitle()).to.eq('ecomApp.prices.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pricesComponentsPage.entities), ec.visibilityOf(pricesComponentsPage.noResult)), 1000);
  });

  it('should load create Prices page', async () => {
    await pricesComponentsPage.clickOnCreateButton();
    pricesUpdatePage = new PricesUpdatePage();
    expect(await pricesUpdatePage.getPageTitle()).to.eq('ecomApp.prices.home.createOrEditLabel');
    await pricesUpdatePage.cancel();
  });

  it('should create and save Prices', async () => {
    const nbButtonsBeforeCreate = await pricesComponentsPage.countDeleteButtons();

    await pricesComponentsPage.clickOnCreateButton();

    await promise.all([pricesUpdatePage.setNotedInput('5'), pricesUpdatePage.setNonNotedInput('5')]);

    expect(await pricesUpdatePage.getNotedInput()).to.eq('5', 'Expected noted value to be equals to 5');
    expect(await pricesUpdatePage.getNonNotedInput()).to.eq('5', 'Expected nonNoted value to be equals to 5');

    await pricesUpdatePage.save();
    expect(await pricesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pricesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Prices', async () => {
    const nbButtonsBeforeDelete = await pricesComponentsPage.countDeleteButtons();
    await pricesComponentsPage.clickOnLastDeleteButton();

    pricesDeleteDialog = new PricesDeleteDialog();
    expect(await pricesDeleteDialog.getDialogTitle()).to.eq('ecomApp.prices.delete.question');
    await pricesDeleteDialog.clickOnConfirmButton();

    expect(await pricesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
