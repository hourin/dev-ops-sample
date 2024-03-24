import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Memo } from '../shared/models';
import { TodoService } from './todo.service';

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
  service = inject(TodoService);

  mode: string = 'new';
  memoId = 0;

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
      this.getMemo();
    }
  }

  backToList(): void {
    // ブラウザバックで戻る
    history.back();
  }

  saveMemo(): void {
    const startMsg = this.mode === 'new' ? '新規作成します。' : '更新します。';
    const msg = startMsg + 'よろしいですか？';
    const form = this.todoForm.getRawValue();
    const request: Memo = {
      id: form.id == null ? 0 : form.id,
      title: form.title == null ? '' : form.title,
      memo: form.memo == null ? '' : form.memo,
    };

    if (window.confirm(msg)) {
      if (this.mode === 'new') {
        // 新規作成
        this.service.create(request).then(() => this.router.navigate(['/']));
      } else {
        // 編集
        this.service.update(request).then(() => this.router.navigate(['/']));
      }
    }
  }

  private getMemo(): void {
    if (this.memoId == null) {
      return;
    }

    this.service.get(this.memoId.toString()).then((_) => {
      this.todoForm.patchValue({
        id: this.memoId,
        title: _.title,
        memo: _.memo,
      });
    });
  }
}
