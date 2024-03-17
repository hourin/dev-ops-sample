import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Memo, MemoUi } from '../shared/models';
import { ApiService } from '../shared/service/api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  api = inject(ApiService);

  async get(id: string): Promise<MemoUi> {
    // Memo => MemoUi に変換して返却
    return await firstValueFrom(
      this.api.get(id).pipe(map((item: Memo) => ({ ...item, checked: true })))
    );
  }

  async create(body: Memo): Promise<void> {
    await firstValueFrom(this.api.create(body));
  }

  async update(body: Memo): Promise<void> {
    await firstValueFrom(this.api.update(body));
  }
}
