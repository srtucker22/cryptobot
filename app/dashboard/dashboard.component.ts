import { Component, OnInit, OnDestroy } from '@angular/core';
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
          solution: quote,
          progress: 0
        };
      });
  }

  encrypt(str: string) {
    const puzzle = this.cryptogramService.encrypt(str);
    this.cryptogram = {
      puzzle,
      solution: puzzle,
      progress: 0
    };
  }

  decrypt(puzzle: string) {
    this.loading = true;
    // this.cryptogramService.decrypt(puzzle).subscribe((cryptogram: Cryptogram) => {
    //   //this.cryptogram = cryptogram;
    //   if(this.cryptogram.progress < 100){
    //     this.loading = true;
    //   }
    //   console.log('cryptogram!', cryptogram);
    // });
  }

  ngOnInit() {
    this.getRandomQuote();

    this.connection = this.cryptogramService
      .connect();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  toggleInfo() {
    this.info = !this.info;
  }
}
