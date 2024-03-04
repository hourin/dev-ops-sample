import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { DUMMY_DATA } from '../dummy-data';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [NgClass, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export default class TodoComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  mode: string = 'new';
  memoId = 0;
  dummyData = DUMMY_DATA;

  todoForm = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(32),
      ],
    }),
    memo: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1024),
      ],
    }),
  });

  get checkTitle(): boolean {
    const isTitle =
      this.todoForm.get('title')?.invalid &&
      (this.todoForm.get('title')?.dirty ||
        this.todoForm.get('title')?.touched);
    return isTitle == null ? true : isTitle;
  }

  get checkMemo(): boolean {
    const isTitle =
      this.todoForm.get('memo')?.invalid &&
      (this.todoForm.get('memo')?.dirty || this.todoForm.get('memo')?.touched);
    return isTitle == null ? true : isTitle;
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') == null) {
      // 新規作成処理
      this.mode = 'new';
    } else {
      // 編集処理
      this.mode = 'edit';
      this.memoId = Number(this.route.snapshot.paramMap.get('id'));
      const target = this.dummyData.filter(
        (memo) => memo.id === this.memoId
      )[0];

      this.todoForm.patchValue({
        id: this.memoId,
        title: target.title,
        memo: target.memo,
      });
    }
  }

  backToList(): void {
    // ブラウザバックで戻る
    history.back();
  }

  saveMemo(): void {
    const startMsg = this.mode === 'new' ? '新規作成します。' : '更新します。';
    const msg = startMsg + 'よろしいですか？';
    if (window.confirm(msg)) {
      // TODO: API 実装予定
      // 現時点では画面遷移のみ
      this.router.navigate(['/']);
    }
  }
}
