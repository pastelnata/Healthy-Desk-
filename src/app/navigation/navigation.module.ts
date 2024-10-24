import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationViewComponent } from './navigation-view/navigation-view.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    NavigationViewComponent,
    
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  exports: [
    NavigationViewComponent
  ]
})
export class NavigationModule { }
