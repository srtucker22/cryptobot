import * as _ from 'underscore';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'loading-dialog',
  moduleId: module.id,
  templateUrl: 'loading-dialog.component.html',
  styleUrls: ['loading-dialog.component.css']
})
export class LoadingDialog implements OnChanges {
  @Input() progress: number;
  bars: number[];

  constructor(
  ) {
  }

  ngOnChanges(changes: any) {
    this.bars = _.range(Math.floor(this.progress/10));
  }
}
