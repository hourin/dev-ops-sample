import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { DUMMY_DATA } from '../dummy-data';
import { MemoUi } from '../shared/models';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule, MatTableModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export default class TodoListComponent {
  dummyData = DUMMY_DATA;
  displayedColumns: string[] = ['checked', 'id', 'title', 'memo'];
  dataSource = new MatTableDataSource<MemoUi>(this.dummyData);

  router = inject(Router);

  memoFilter = () =>
    this.dummyData
      .filter((data) => data.checked === true)
      .map((data) => data.id);

  /**
   * 全選択処理
   * @returns{void}
   */
  checkAll(): void {
    this.dummyData.forEach((data) => (data.checked = true));
  }

  clearCheckAll(): void {
    this.dummyData.forEach((data) => (data.checked = false));
  }

  deleteMemo(): void {
    const deleteTarget = this.memoFilter();

    if (deleteTarget.length === 0) {
      window.alert('削除対象が選択されていません');
      return;
    }

    if (window.confirm('削除します。よろしいですか？')) {
      this.dummyData = this.dummyData.filter(
        (item) => !deleteTarget.includes(item.id)
      );
      this.dataSource = new MatTableDataSource<MemoUi>(this.dummyData);
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
}
