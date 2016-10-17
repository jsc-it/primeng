import { NgModule, ModuleWithProviders } from "@angular/core";
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { HttpModule } from '@angular/http';

import { MessageService } from './message.service';
import { MessagesComponent } from './messages.component';
import { CommonModule } from '@angular/common';


@NgModule({
	imports: [CommonModule],
	declarations: [MessagesComponent],
	exports: [MessagesComponent],
	providers: [MessageService]
})

export class MessagesModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MessagesModule,
			providers: [MessageService]
		};
	}
}


