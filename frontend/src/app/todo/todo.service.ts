import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { Memo, MemoUi } from '../shared/models';
import { ApiService } from '../shared/service/api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  api = inject(ApiService);

  memoData$ = new BehaviorSubject<MemoUi>({
    checked: false,
    id: 0,
    title: '',
    memo: '',
  });

  async get(id: string) {
    const memoData = await firstValueFrom(
      // Memo => MemoUi に変換
      this.api.get(id).pipe(map((item: Memo) => ({ ...item, checked: true })))
    );

    // MemoUi をストリームに流す
    this.memoData$.next(memoData);
  }
}
