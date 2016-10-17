import { TemplateLoader } from './../common/shared';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Message, MessageSeverityEnum, MessageCause } from '../common/rc-api';
import { MessageService, MessageEvent } from './message.service';

/**
 * Component to render messages with a message dialog.
 *
 * @see XSP Message & Error Handling Concept
 * https://s415vmmt060.detss.corpintra.net/confluence/x/kg9CAQ
 * 
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Component({
	selector: 'rc-messages',
	// because of a bug in angular 2.0.0 we can not use *ngIf="(messages$ | async)?.length>0" in the first <div> of the template.
	// see https://github.com/angular/angular/issues/9641
	template: `
		<div> 
			<div *ngFor="let msgWrapper of messages$ | async" class="rc-message" (click)="showDialog($event, msgWrapper)">
				<span class="{{ msgWrapper.messageClass }}-icon"></span>
				<span class="{{ msgWrapper.messageClass }} rc-message-text">{{msgWrapper.message.useCaseId}}</span>
				<a *ngIf="msgWrapper.hasMessageCause" class="rc-message-detail"></a>
			</div>
		</div>
		<ui-message-causes [selectedMessage]="selectedMessageWrapper"></ui-message-causes>
		`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {

	/** Selected message (by clicking the detail icon). */
	private selectedMessageWrapper: MessageWrapper;

	private messages$: Observable<MessageWrapper[]>;

	@Input() private name: string;

	/**
	 * Constructor for the {MessagesComponent}.
	 *
	 * @param {MessageService} messageService - The injected message service.
	 */
	constructor(private messageService: MessageService) { }

	/**
	 * Called after the constructor, subscribing to the {MessageService}.
	 */
	public ngOnInit(): void {
		this.messages$ = this.messageService
			.filter((messageEvent: MessageEvent) => {
				if (MessageService.ADD_EVENT === messageEvent.type && messageEvent.target) {
					if (this === messageEvent.target || messageEvent.target === this.name) {
						return true;
					} else {
						// not the right target
						return false;
					}
				}
				// if target not specified then show message
				return true;
			})
			.scan((messages: MessageWrapper[], currentValue: MessageEvent, index: number) => {
				switch (currentValue.type) {
					case MessageService.ADD_EVENT:
						let messageWrapper: MessageWrapper = this.find(messages, currentValue.message);
						if (messageWrapper) {
							if (currentValue.messageCauses && currentValue.messageCauses.length > 0) {
								messageWrapper.messageCauses = messageWrapper.messageCauses.concat(currentValue.messageCauses);
							}
						} else {
							messages.push(this.createNewMessageWrapper(currentValue));
						}
						break;
					case MessageService.REMOVE_EVENT:
						messageWrapper = this.find(messages, currentValue.message);
						if (messageWrapper) {
							messages.splice(messages.indexOf(messageWrapper), 1);
						}
						break;
					case MessageService.REMOVE_ALL_EVENT:
						messages = [];
					default:
				}
				return messages;
			}, []
			);
	}

	/**
	 * Adds a {Message}.
	 * 
	 * @param {Message} message 
	 * @param {MessageOptions} [messageOptions={}]
	 */
	public addMessage(message: Message, error: any = undefined) {
		this.messageService.addMessage(message, { error: error, target: this });
	}

	/**
	 * Resolves the style class (css) based on a given message.
	 *
	 * @param {Message} message - to resolve class from.
	 * @return style class as string
	 */
	private resolveMessageClass(message: Message): string {
		if (message.severity.toString() === MessageSeverityEnum.INFO.toString()) {
			return 'rc-message-info';
		} else if (message.severity.toString() === MessageSeverityEnum.WARN.toString()) {
			return 'rc-message-warn';
		} else {
			return 'rc-message-error';
		}
	}

	private showDialog(event: any, messageWrapper: MessageWrapper): void {
		this.selectedMessageWrapper = messageWrapper;
		if (event) {
			event.preventDefault();
		}
	}

	private find(messages: MessageWrapper[], message: Message): MessageWrapper {
		return messages.find((msgW: MessageWrapper, index: number, array: MessageWrapper[]) => {
			return msgW.message.useCaseId === message.useCaseId;
		});
	}

	private createNewMessageWrapper(messageAction: MessageEvent): MessageWrapper {
		return {
			message: messageAction.message,
			messageCauses: messageAction.messageCauses,
			hasMessageCause: !!(messageAction.messageCauses && messageAction.messageCauses.length > 0),
			messageClass: this.resolveMessageClass(messageAction.message)
		};
	}

}

export interface MessageWrapper {
	message: Message,
	messageCauses?: MessageCause[],
	hasMessageCause: boolean
	messageClass: string,
}
