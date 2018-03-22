import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCardPage } from './create-card';

@NgModule({
  declarations: [
    CreateCardPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCardPage),
  ],
})
export class CreateCardPageModule {}
