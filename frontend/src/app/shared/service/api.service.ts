import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Memo } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  apiUrl = 'サーバーアドレス/api/memos';

  getAll(): Observable<Array<Memo>> {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/memo-list.json';
    return this.http.get<Array<Memo>>(this.apiUrl);
  }

  get(id: string): Observable<Memo> {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/memo.json';

    // 暫定で下記実装にしている。正しいエンドポイントには、`/${id}` が含まれる
    return this.http.get<Memo>(this.apiUrl);
    // return this.http.get<Memo>(this.apiUrl + `/${id}`);
  }

  create(body: Memo) {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/post.json';
    return this.http.post(this.apiUrl, body);
  }

  update(body: Memo) {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/update.json';
    return this.http.patch(this.apiUrl, body);
  }

  delete(id: string) {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/delete.json';

    // 暫定で下記実装にしている。正しいエンドポイントには、`/${id}` が含まれる
    return this.http.delete(this.apiUrl);
    // return this.http.delete(this.apiUrl + `/${id}`);
  }
}
