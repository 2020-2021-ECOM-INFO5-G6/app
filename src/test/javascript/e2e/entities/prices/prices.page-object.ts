import { element, by, ElementFinder } from 'protractor';

export class PricesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-prices div table .btn-danger'));
  title = element.all(by.css('jhi-prices div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class PricesUpdatePage {
  pageTitle = element(by.id('jhi-prices-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  notedInput = element(by.id('field_noted'));
  nonNotedInput = element(by.id('field_nonNoted'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNotedInput(noted: string): Promise<void> {
    await this.notedInput.sendKeys(noted);
  }

  async getNotedInput(): Promise<string> {
    return await this.notedInput.getAttribute('value');
  }

  async setNonNotedInput(nonNoted: string): Promise<void> {
    await this.nonNotedInput.sendKeys(nonNoted);
  }

  async getNonNotedInput(): Promise<string> {
    return await this.nonNotedInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class PricesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-prices-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-prices'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
