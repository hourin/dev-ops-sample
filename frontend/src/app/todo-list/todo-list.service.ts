import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Memo, MemoUi } from '../shared/models';
import { ApiService } from '../shared/service/api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  api = inject(ApiService);

  async getAll(): Promise<MemoUi[]> {
    // Memo[] => MemoUi[] に変換して返却
    return await firstValueFrom(
      this.api.getAll().pipe(
        map((memos: Memo[]) => {
          return memos.map((item: Memo) => ({ ...item, checked: false }));
        })
      )
    );
  }
}
