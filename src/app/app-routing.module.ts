import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'advanced-geolocation', loadChildren: './pages/advanced-geolocation/advanced-geolocation.module#AdvancedGeolocationModule' },
  { path: 'manual-scan', loadChildren: './pages/manual-scan/manual-scan.module#ManualScanModule' },
  { path: 'auto-scan', loadChildren: './pages/auto-scan/auto-scan.module#AutoScanModule' },
  //
  // { path: 'geolocation', loadChildren: './pages/geolocation/geolocation.module#GeolocationModule' },
  // { path: 'new-item', loadChildren: './pages/new-item/new-item.module#NewItemPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
