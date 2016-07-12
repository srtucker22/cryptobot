import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Cryptogram } from './cryptogram';

@Injectable()
export class CryptogramService {
  private cryptogramUrl = 'app/cryptogram';  // URL to web api
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
}
