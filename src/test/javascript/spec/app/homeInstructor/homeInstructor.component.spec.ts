import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EcomTestModule } from '../../test.module';
import { HomeInstructorComponent } from 'app/homeInstructor/homeInstructor.component';
import { AccountService } from 'app/core/auth/account.service';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeInstructorComponent;
    let fixture: ComponentFixture<HomeInstructorComponent>;
    let accountService: AccountService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [EcomTestModule],
        declarations: [HomeInstructorComponent],
      })
        .overrideTemplate(HomeInstructorComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeInstructorComponent);
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
