import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutMeModalPage } from './about-me-modal';

@NgModule({
  declarations: [
    AboutMeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutMeModalPage),
  ],
})
export class AboutMeModalPageModule {}
