import * as io from 'socket.io-client';
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Cryptogram } from './cryptogram';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CryptogramService {
  private cryptogramUrl = 'http://localhost:8000';  // URL to web api
  private oldUrl = 'app/cryptogram';
  private socket: any;

  constructor(private http: Http) { }
  getCryptogram(): Promise<Cryptogram> {
    return this.http.get(this.cryptogramUrl)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  solveRequest(cryptogram: Cryptogram){
    this.socket.emit('solve', cryptogram);
  }

  connect() {
    let observable = new Observable((observer: any) => {
      this.socket = io(this.cryptogramUrl);
      this.socket.on('data', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
