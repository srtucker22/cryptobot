import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Cryptogram } from '../cryptogram/cryptogram'
import { CryptogramService } from '../cryptogram/cryptogram.service';

@Component({
  selector: 'my-dashboard',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  cryptogram: Cryptogram;
  connection: any;


  constructor(
    private router: Router,
    private cryptogramService: CryptogramService
  ) {
  }

  ngOnInit() {
    this.cryptogram = {
      id: 0;
      puzzle: 'this is a test';
      solution: 'this is a solution';
      progress: 0;
    };
    
    this.connection = this.cryptogramService
      .connect()
      .subscribe(cryptogram => {
        console.log('cryptogram!', cryptogram);
        //this.cryptogram = cryptogram;
      });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
