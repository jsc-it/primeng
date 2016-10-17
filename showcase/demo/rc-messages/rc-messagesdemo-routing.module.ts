import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RcMessagesDemo} from './rc-messagesdemo';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'', component: RcMessagesDemo}
		])
	],
	exports: [
		RouterModule
	]
})
export class RcMessagesDemoRoutingModule {}
