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
  observable: Observable;

  constructor(
    private router: Router,
    private cryptogramService: CryptogramService
  ) {
  }

  getRandomQuote() {
    this.cryptogramService.getRandomQuote()
      .then(quote => {
        console.log('quote', quote);
        this.cryptogram = {
          id: 0,
          puzzle: quote,
          solution: quote,
          progress: 0
        };
      });
  }

  encrypt(str) {
    const puzzle = this.cryptogramService.encrypt(str);
    this.cryptogram = {
      puzzle,
      solution: puzzle,
      progress: 0
    };
  }

  decrypt(puzzle) {
    this.cryptogramService.decrypt(puzzle);
  }

  ngOnInit() {
    this.getRandomQuote();

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
