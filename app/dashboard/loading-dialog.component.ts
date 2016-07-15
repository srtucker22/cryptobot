import { Component } from '@angular/core';

@Component({
  selector: 'loading-dialog',
  moduleId: module.id,
  templateUrl: 'loading-dialog.component.html',
  styleUrls: ['loading-dialog.component.css']
})
export class LoadingDialog {
  bars: boolean[] = [true, true];

  constructor(
  ) {
  }
}
