import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { Memo, MemoUi } from '../shared/models';
import { ApiService } from '../shared/service/api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  api = inject(ApiService);

  moemoList$ = new BehaviorSubject<MemoUi[]>([]);

  async getAll() {
    const memoList = await firstValueFrom(
      this.api.getAll().pipe(
        map((memos: Memo[]) => {
          return memos.map((item: Memo) => ({ ...item, checked: false }));
        })
      )
    );
    this.moemoList$.next(memoList);
  }
}
