import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-home',
  templateUrl: './login.component.html',
  styleUrls: ['login.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  constructor(private accountService: AccountService, private loginModalService: LoginModalService, private router: Router) {}

  ngOnInit(): void {
    /* Security
    console.log(this.isAuthenticated()); // return false ???
    if (this.isAuthenticated()){
      console.log("PASSED");
      if(this.accountService.hasAnyAuthority('ROLE_INSTRUCTOR'))
        this.router.navigate(['/homeInstructor']);
      else if (this.accountService.hasAnyAuthority('ROLE_STUDENT'))
        this.router.navigate(['/homeStudent']);
    }
    else */ // Doesn't work ???
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
