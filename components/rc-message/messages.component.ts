import { Component, Input, OnInit } from '@angular/core';

import { Message, MessageSeverityEnum } from '../common/rc-api';
import { MessageService } from './message.service';

/**
 * Component to render messages with a proper messages dialog.
 *
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Component({
	selector: 'ui-messages',
	template: `
		<div *ngIf="hasMessages()">
			<div *ngFor="let msg of getUniqueMessages()" class="rc-message" (click)="showDialog($event, msg)">
				<span class="{{ getMessageClass(msg) }}-icon"></span>
				<span class="{{ getMessageClass(msg) }} rc-message-text">{{msg.useCaseId | translate}}</span>
				<a class="rc-message-detail"></a>
			</div>
		</div>
		`
	// <ui-message-causes [messages]="selectedMessages"></ui-message-causes>
})
export class MessagesComponent implements OnInit {

	/** Messages to display. */
	@Input() messages: Message[];

	/** Selected message (by clicking the detail icon). */
	selectedMessage: Message;

	/**
	 * Constructor for the {@link MessagesComponent}.
	 *
	 * @param {TranslateService} translate - The injected translate service.
	 */
	constructor(private messageService: MessageService) { }

	/**
	 * Lifecycle hook to subscribe to {@link MessageService}
	 */
	public ngOnInit(): void {
		this.messageService.addedUiMessages().subscribe(
			(message: Message) => {
				this.messages.push(message);
				if (message.openPopupImmediately || message.severity.toString() === MessageSeverityEnum.FATAL.toString()) {
					this.showDialog(undefined, message);
				}
			}
		);
	}


	/**
	 * Resolves the style class (css) based on a given message.
	 *
	 * @param {Message} message - to resolve class from.
	 * @return style class as string
	 */
	static messageClass(message: Message): string {
		if (message.severity.toString() === MessageSeverityEnum.INFO.toString()) {
			return 'rc-message-info';
		} else if (message.severity.toString() === MessageSeverityEnum.WARN.toString()) {
			return 'rc-message-warn';
		} else {
			return 'rc-message-error';
		}
	}

	/**
	 * Indicates if {MessagesComponent} should be shown.
	 *
	 * @return true, if there are messages
	 */
	hasMessages(): boolean {
		return this.messages != null && this.messages.length > 0;
	}

	/**
	 * See {MessagesComponent#messageClass(Message)}.
	 */
	getMessageClass(message: Message): string {
		return MessagesComponent.messageClass(message);
	}

	/**
	 * Opens the causes dialog for a message.
	 */
	showDialog(event: any, message: Message): void {
		this.selectedMessage = message;
		if (event) {
			event.preventDefault();
		}
	}
}
