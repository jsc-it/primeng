import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {TranslateService} from 'ng2-translate';

import {Message} from '../common/rc-api';
import {MessagesComponent} from './messages.component';

/**
 * Component to render messages with a proper messages dialog.
 *
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Component({
	selector: 'ui-message-causes',
	template: `
		<p-dialog [header]="getTitle() | async" class="rc-message-causes ui-force-center" [width]="600" [visible]="visible"
			(onBeforeHide)="reset()" [draggable]="false" [modal]="true" appendTo="body">
		<div *ngIf="messages" class="rc-message-cause-body">
			<div class="rc-message">
				<span class="{{ getMessageClass(messages[0]) }}-icon"></span>
				<span class="{{ getMessageClass(messages[0]) }} rc-message-text">{{ messages[0].useCaseId | translate }}</span>
			</div>
			<p-panel *ngFor="let msg of messages;let i = index;" class="rc-message-cause" header="{{ msg.cause }}" [toggleable]="true" [collapsed]="i==0?false:true">
				<div *ngIf="msg.remediation" class="rc-message-cause-remediation">{{ msg.remediation }}</div>
				<table class="rc-message-cause-detail">
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.common.Common.Messages.Source' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msg.source }}
						</td>
					</tr>
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.common.Common.Messages.FaultCode' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msg.technicalId }}
						</td>
					</tr>
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.common.Common.Messages.FaultCodeDesc' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msg.technicalText }}
						</td>
					</tr>
				</table>
			</p-panel>
			<div *ngIf="xsfSupported" class="rc-message-cause-description">
				<div class="rc-message-cause-description-label">
					Problembeschreibung
				</div>
				<textarea class="rc-message-cause-description-textarea" [(value)]="userDescription"></textarea>
			</div>
			<div class="rc-message" *ngIf="xsfError">
				<span class="rc-message-error-icon"></span>
				<span class="rc-message-error rc-message-text">{{'sbb.ri.cockpit.main.Messages.msg.ErrorCreatingXsfTicket' | translate}} {{ xsfError?.causeLocalized }}</span>
			</div>
		</div>
		<footer>
			<div class="rc-message-cause-button-bar">
				<button type="button" *ngIf="xsfSupported" [disabled]="xsfRequestInProgress" pButton (click)="sendTicket()" label="{{'sbb.ri.cockpit.main.Messages.lbl.SendXsfTicket' | translate}}" class="ui-primary"></button>
			</div>
		</footer>
	</p-dialog>
	`
})
export class MessageCausesComponent {

	/** On usecase filtered messages to display. */
	@Input()
	message: Message;

	/** Indicates if the causes dialog is shown. */
	visible: boolean = false;

	/** Indicates if the XSF support is implemented TDRF RETACCB-3461. */
	xsfSupported: boolean = true;

	userDescription: string = '';

	xsfRequestInProgress: boolean = false;

	xsfError: any;

	/**
	 * Constructor for the {@link MessageCausesComponent}.
	 *
	 * @param {TranslateService} translate - The injected translate service.
	 */
	constructor(private translateService: TranslateService) { }

	/** Callback used when the causes dialog is closed. */
	reset(): void {
		this.visible = false;
		this.xsfError = null;
		this.userDescription = null;
	}

	sendTicket(): void {
		this.xsfRequestInProgress = true;
		window['rcSupport'].sendSupportRequestViaWebservice(this.message.useCaseId, this.userDescription, false, [], []).then(response => {
			this.xsfError = response.rcSupportErrorPlain;
			this.xsfRequestInProgress = false;
			if (!this.xsfError) {
				this.visible = false;
			}
		});
	}

	/**
	 * Resolves the title of the causes dialog.
	 *
	 * @return the dialog title as {Observable}
	 */
	getTitle(): Observable<string | any> {
		if (this.message) {
			return this.translateService.get({
				INFO: 'core.fwk.common.Common.Messages.TitleInfo',
				WARN: 'core.fwk.common.Common.Messages.TitleWarning',
				ERROR: 'core.fwk.common.Common.Messages.TitleError',
				FATAL: 'core.fwk.common.Common.Messages.TitleCriticalError'
			}[this.message.severity.toString()]);
		}
		return Observable.empty();
	}

	/** See {MessagesComponent#messageClass(Message)}. */
	getMessageClass(message: Message): string {
		return MessagesComponent.messageClass(message);
	}

	ngOnChanges() {
		this.visible = this.message ? true : false;
	}
}
