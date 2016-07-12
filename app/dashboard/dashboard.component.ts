import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Cryptogram } from '../cryptogram/cryptogram'
import { CryptogramService } from '../cryptogram/cryptogram.service';

@Component({
  selector: 'my-dashboard',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cryptogram: Cryptogram;

  constructor(
    private router: Router,
    private cryptogramService: CryptogramService
  ) {
  }

  ngOnInit() {
    this.cryptogramService.getCryptogram()
      .then(cryptogram => this.cryptogram = cryptogram);
  }
}
