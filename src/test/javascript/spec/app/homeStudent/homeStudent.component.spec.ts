import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EcomTestModule } from '../../test.module';
import { HomeStudentComponent } from 'app/homeStudent/homeStudent.component';
import { AccountService } from 'app/core/auth/account.service';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeStudentComponent;
    let fixture: ComponentFixture<HomeStudentComponent>;
    let accountService: AccountService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EcomTestModule],
        declarations: [HomeStudentComponent],
      })
        .overrideTemplate(HomeStudentComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeStudentComponent);
      comp = fixture.componentInstance;
      accountService = TestBed.get(AccountService);
    });

    it('Should call accountService.getAuthenticationState on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(accountService.getAuthenticationState).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(accountService.isAuthenticated).toHaveBeenCalled();
    });
  });
});
