import { Component, Input } from '@angular/core';


@Component({
    selector:    'studio-billing-loading',
    templateUrl: './loading.component.html',
})
export class LoadingComponent {
    @Input() public type: string = 'sk-cube-grid';
}
