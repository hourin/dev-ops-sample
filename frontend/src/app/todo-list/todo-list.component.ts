import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MemoUi } from '../shared/models';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule, MatTableModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export default class TodoListComponent implements OnInit {
  displayedColumns: string[] = ['checked', 'id', 'title', 'memo'];

  router = inject(Router);
  service = inject(TodoListService);

  memoList: MemoUi[] = [];
  dataSource = new MatTableDataSource<MemoUi>();

  memoFilter = () =>
    this.memoList
      .filter((data) => data.checked === true)
      .map((data) => data.id);

  ngOnInit(): void {
    this.getAll();
  }

  /**
   * 全選択処理
   * @returns{void}
   */
  checkAll(): void {
    this.memoList.forEach((data) => (data.checked = true));
  }

  clearCheckAll(): void {
    this.memoList.forEach((data) => (data.checked = false));
  }

  deleteMemo(): void {
    const deleteTarget = this.memoFilter();

    if (deleteTarget.length === 0) {
      window.alert('削除対象が選択されていません');
      return;
    }

    if (window.confirm('削除します。よろしいですか？')) {
      const id = deleteTarget[0].toString();
      // 削除が成功したら、メモ一覧を再取得・更新する
      this.service.delete(id).then(() => this.getAll());
    }
  }

  createMemo(): void {
    this.router.navigate(['new']);
  }

  editMemo(): void {
    const editTarget = this.memoFilter();
    if (editTarget.length === 0) {
      window.alert('編集対象が選択されていません');
      return;
    }

    if (editTarget.length > 1) {
      window.alert('編集対象がは一つです。');
      return;
    }

    this.router.navigate(['edit', editTarget[0]]);
  }

  private getAll(): void {
    this.service.getAll().then((_) => {
      this.memoList = _;
      this.dataSource = new MatTableDataSource<MemoUi>(this.memoList);
    });
  }
}
