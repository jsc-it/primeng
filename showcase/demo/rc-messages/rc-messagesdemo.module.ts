import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {RcMessagesDemo} from './rc-messagesdemo';
import {RcMessagesDemoRoutingModule} from './rc-messagesdemo-routing.module';
import {ButtonModule} from '../../../components/button/button';
import {TabViewModule} from '../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../components/codehighlighter/codehighlighter';
import {MessagesModule} from '../../../components/rc-messages/messages.module';

@NgModule({
	imports: [
		CommonModule,
		RcMessagesDemoRoutingModule,
        MessagesModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
	],
	declarations: [
		RcMessagesDemo
	]
})
export class RcMessagesDemoModule { }
