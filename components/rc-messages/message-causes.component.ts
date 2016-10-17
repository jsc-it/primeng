import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';

import { MessageWrapper } from './messages.component';
import { Message } from '../common/rc-api';
import { MessagesComponent } from './messages.component';

/**
 * Component to render message causes in a dialog.
 *
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Component({
	selector: 'ui-message-causes',
	template: `
		<p-dialog [header]="getTitle() | async" class="rc-message-causes ui-force-center" [width]="600" [visible]="visible"
			(onBeforeHide)="reset()" [draggable]="false" [modal]="true" appendTo="body">
		<div *ngIf="selectedMessage" class="rc-message-cause-body">
			<div class="rc-message">
				<span class="{{ selectedMessage.messageClass }}-icon"></span>
				<span class="{{ selectedMessage.messageClass }} rc-message-text">{{ selectedMessage.message.useCaseId | translate }}</span>
			</div>
			<p-panel *ngFor="let msgCause of selectedMessage.message.messageCauses;let i = index;" class="rc-message-cause" 
			header="{{ msgCause.category ? msgCause.category : ('core.fwk.main.CoreNG.lbl.OtherError' | translate ) }}" [toggleable]="true" [collapsed]="i==0?false:true">
				<div class="rc-message-cause-remediation">{{ msgCause.cause ? msgCause.cause : ( 'core.fwk.main.CoreNG.msg.UnknownError' | translate) }}</div>
				<div *ngIf="msgCause.remediation" class="rc-message-cause-remediation">{{ msgCause.remediation }}</div>
				<table class="rc-message-cause-detail">
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.main.CoreNG.lbl.Source' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msgCause.source }}
						</td>
					</tr>
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.main.CoreNG.lbl.FaultCode' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msgCause.technicalId }}
						</td>
					</tr>
					<tr>
						<td class="rc-message-cause-label">
							<label>{{'core.fwk.main.CoreNG.lbl.FaultCodeDesc' | translate}}:</label>
						</td>
						<td class="rc-message-cause-value">
							{{ msgCause.technicalText }}
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
				<button type="button" *ngIf="xsfSupported" [disabled]="xsfRequestInProgress" pButton (click)="sendTicket()" label="{{'core.fwk.main.CoreNG.lbl.SendXsfTicket' | translate}}" class="ui-primary"></button>
			</div>
		</footer>
	</p-dialog>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageCausesComponent {

	/** On usecase filtered messages to display. */
	@Input()
	selectedMessage: MessageWrapper;

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
		let message: Message = this.selectedMessage.message;
		this.xsfRequestInProgress = true;
		window['rcSupport'].sendSupportRequestViaWebservice(message.useCaseId, this.userDescription, false, [], []).then(response => {
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
		if (this.selectedMessage.message) {
			return this.translateService.get({
				INFO: 'core.fwk.main.CoreNG.lbl.TitleInfo',
				WARN: 'core.fwk.main.CoreNG.lbl.TitleWarning',
				ERROR: 'core.fwk.main.CoreNG.lbl.TitleError',
				FATAL: 'core.fwk.main.CoreNG.lbl.TitleCriticalError'
			}[this.selectedMessage.message.severity.toString()]);
		}
		return Observable.empty();
	}

	// ngOnChanges() {
	// 	this.visible = this.message ? true : false;
	// }
}
