import * as _ from 'underscore';
import * as io from 'socket.io-client';
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Cryptogram } from './cryptogram';
import { Observable } from 'rxjs/Observable';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

@Injectable()
export class CryptogramService {
  private cryptogramUrl = 'http://localhost:8000';  // URL to web api
  private oldUrl = 'app/cryptogram';
  private socket: any;

  constructor(private http: Http) { }
  getRandomQuote(): Promise<string> {
    return this.http.get(this.cryptogramUrl + '/files/random')
      .toPromise()
      .then(response => response.json().quote)
      .catch(this.handleError);
  }

  encrypt(str): Cryptogram {
    // return the deciphered puzzle
    function getCipherText(cipher, puzzle) {
      const answer = _.map(puzzle, (x)=> {
        return _.has(cipher, x) ? cipher[x] : x;
      });
      return answer.join('');
    }

    const alphabetClone = ALPHABET.slice(0).split('');
    let cipher = _.object(_.map(ALPHABET, (letter)=>{
      let rand = Math.floor(Math.random() * alphabetClone.length);
      return [letter, alphabetClone.splice(rand, 1)[0]];
    }));
    return getCipherText(cipher, str);
  }

  decrypt(): Observable {
    return this.observable;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  solveRequest(cryptogram: Cryptogram){
    this.socket.emit('solve', cryptogram);
  }

  connect() {
    this.observable = new Observable((observer: any) => {
      this.socket = io(this.cryptogramUrl);
      this.socket.on('data', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return this.observable;
  }
}
