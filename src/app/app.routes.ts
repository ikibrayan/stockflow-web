import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const loadLogin=()=>import('./features/auth/login/login').then(m=>m.Login);
const loadShell=()=>import('./layout/shell/shell').then(m=>m.Shell);
const loadDashboard=()=>import('./features/dashboard/dashboard').then(m=>m.Dashboard);
const loadProducts=()=>import('./features/products/products').then(m=>m.Products);
const loadCategories=()=>import('./features/categories/categories').then(m=>m.Categories);
const loadCustomers=()=>import('./features/customers/customers').then(m=>m.Customers);
const loadSales=()=>import('./features/sales/sales').then(m=>m.Sales);
const loadInventory=()=>import('./features/inventory/inventory').then(m=>m.Inventory);

export const routes:Routes=[
  {
    path:'login',
    loadComponent:loadLogin
  },
  {
    path:'',
    loadComponent:loadShell,
    canActivate:[authGuard],
    children:[
      {
        path:'',
        pathMatch:'full',
        redirectTo:'dashboard'
      },
      {
        path:'dashboard',
        loadComponent:loadDashboard
      },
      {
        path:'products',
        loadComponent:loadProducts
      },
      {
        path:'categories',
        loadComponent:loadCategories
      },
      {
        path:'customers',
        loadComponent:loadCustomers
      },
      {
        path:'sales',
        loadComponent:loadSales
      },
      {
        path:'inventory',
        loadComponent:loadInventory
      }
    ]
  },
  {
    path:'**',
    redirectTo:'dashboard'
  }
];