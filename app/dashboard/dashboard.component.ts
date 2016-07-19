import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Cryptogram } from '../cryptogram/cryptogram'
import { CryptogramService } from '../cryptogram/cryptogram.service';

import { LoadingDialog } from './loading-dialog.component';
import { About } from './about.component';

@Component({
  selector: 'my-dashboard',
  moduleId: module.id,
  directives: [LoadingDialog, About],
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  cryptogram: Cryptogram;
  connection: any;
  info: boolean = false;
  loading: boolean;
  public boundClose: Function;

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
          puzzle: quote,
          progress: 0
        };
      });
  }

  encrypt(str: string) {
    const puzzle = this.cryptogramService.encrypt(str);
    this.cryptogram = {
      puzzle,
      progress: 0
    };
  }

  decrypt(puzzle: string) {
    this.loading = true;
    this.cryptogramService.decrypt(puzzle).subscribe((cryptogram: Cryptogram) => {
      this.cryptogram = cryptogram;
      if(this.cryptogram.progress < 100){
        this.loading = true;
      } else {
        this.loading = false;
      }
    });
  }

  close() {
    this.info = false;
  }

  ngOnInit() {
    this.getRandomQuote();
    this.boundClose = this.close.bind(this);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  toggleInfo() {
    this.info = !this.info;
  }
}
