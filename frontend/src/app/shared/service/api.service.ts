import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { MemoUi } from '../models/memo-ui';
import { Memo } from '../models/memo';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  apiUrl = 'サーバーアドレス/api/memos';

  getAll(): Observable<Array<MemoUi>> {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/memo-list.json';
    return this.http.get<Array<Memo>>(this.apiUrl).pipe(
      map((memos: Memo[]) => {
        return memos.map((item: Memo) => ({ ...item, checked: false }));
      })
    );
  }

  get(id: string): Observable<MemoUi> {
    // ダミーで、./assets/json 配下の json をレスポンスとして取得
    this.apiUrl = './assets/json/memo.json';
    return this.http
      .get<MemoUi>(this.apiUrl + `/${id}`)
      .pipe(map((item: Memo) => ({ ...item, checked: true })));
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
    return this.http.delete(this.apiUrl + `/${id}`);
  }
}
