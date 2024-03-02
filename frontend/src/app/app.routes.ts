import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./todo-list/todo-list.component'),
  },
  {
    path: 'new',
    pathMatch: 'full',
    loadComponent: () => import('./todo/todo.component'),
  },
  {
    path: 'edit/:id',
    pathMatch: 'full',
    loadComponent: () => import('./todo/todo.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component'),
  },
];
