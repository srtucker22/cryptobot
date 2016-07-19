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
  private observable: Observable<any>;

  constructor(private http: Http) {
    this.socket = io(this.cryptogramUrl);
    console.log('this.socket', this.socket);
  }

  getRandomQuote(): Promise<string> {
    return this.http.get(this.cryptogramUrl + '/files/random')
      .toPromise()
      .then(response => response.json().quote)
      .catch(this.handleError);
  }

  encrypt(str: string): string {
    // return the deciphered puzzle
    function getCipherText(cipher: any, puzzle: string) {
      const answer = _.map(puzzle, (x: string)=> {
        return _.has(cipher, x.toLowerCase()) ? (x == x.toLowerCase() ? cipher[x] : cipher[x.toLowerCase()].toUpperCase()) : x;
      });
      return answer.join('');
    }

    const shuffled = _.shuffle(ALPHABET);
    let cipher = _.object(_.map(ALPHABET, (letter: string, index: number)=>{
      return [letter, shuffled[index]];
    }));
    return getCipherText(cipher, str);
  }

  decrypt(puzzle: string): Observable<any> {
    this.socket.emit('decrypt', {
      puzzle,
      progress: 0
    });

    this.observable = new Observable((observer: any) => {
      this.socket.on('data', (data: any) => {
        console.log('data', data);
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return this.observable;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  solveRequest(cryptogram: Cryptogram){
    this.socket.emit('solve', cryptogram);
  }
}
