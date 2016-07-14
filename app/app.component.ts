import { Component }       from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { CryptogramService } from './cryptogram/cryptogram.service';

@Component({
  selector: 'my-app',
  moduleId: module.id,
  styleUrls: ['app.component.css'],
  template: `
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [
    CryptogramService
  ]
})
export class AppComponent {
  title = 'Cryptobot';
}
