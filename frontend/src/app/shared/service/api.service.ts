import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Memo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  apiUrl = 'サーバーアドレス/api/memos';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  getAll(): Observable<Array<Memo>> {
    return this.http.get<Array<Memo>>(this.apiUrl, this.httpOptions);
  }

  get(id: string): Observable<Memo> {
    return this.http.get<Memo>(this.apiUrl + `/${id}`, this.httpOptions);
  }

  create(body: Memo) {
    return this.http.post(this.apiUrl, body, this.httpOptions);
  }

  update(body: Memo) {
    return this.http.patch(this.apiUrl, body, this.httpOptions);
  }

  delete(id: string) {
    return this.http.delete(this.apiUrl + `/${id}`, this.httpOptions);
  }
}
