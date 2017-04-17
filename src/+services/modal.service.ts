import { EventEmitter, Injectable } from '@angular/core';


@Injectable()
export class ModalService {
    public title: string = '';
    public events: EventEmitter<string> = new EventEmitter();
}
