import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Message } from '../common/rc-api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MessagesComponent } from './messages.component';
import { MessageCause } from './../common/rc-api';


/**
 * Service that handles Messages & Errors on XSP.
 * 
 * @see XSP Message & Error Handling Concept
 * https://s415vmmt060.detss.corpintra.net/confluence/x/kg9CAQ
 * 
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Injectable()
export class MessageService extends Subject<MessageEvent>{
	public static ADD_EVENT: string = "ADD MESSAGE";
	public static REMOVE_EVENT: string = "REMOVE MESSAGE";
	public static REMOVE_ALL_EVENT: string = "REMOVE ALL MESSAGES";

	public addMessage(message: Message, messageOptions: MessageOptions = {}): void {
		this.internalAddMessage(message, messageOptions.error, messageOptions.target);
	}

	public removeMessage(message: Message): void {
		this.next({ type: MessageService.REMOVE_EVENT, message });
	}

	public removeAllMessages(): void {
		this.next({ type: MessageService.REMOVE_ALL_EVENT });
	}

	private internalAddMessage(message: Message, error: any, target: MessagesComponent | string): void {
		let messageEvent: MessageEvent = { type: MessageService.ADD_EVENT, message, target }
		if (error) {
			messageEvent.messageCauses = new Array(this.transformErrorToMessageCause(error));
		} else {
			messageEvent.messageCauses = message.messageCauses;
		}
		this.next(messageEvent);
	}

	private transformErrorToMessageCause(error: any): MessageCause {
		// comes the error unwrapped from the server?
		if (error instanceof Response) {
			error = error.json();
		}
		// is the error an MessageCause instance?
		if (error.hasOwnProperty("cause")) {
			return error;
		}
		// if not a MessageCause instance then we return a generic message cause and use the error as technical text.
		return {
			category: "Other error", // TODO in coreNg textmodules
			cause: "UnknownError",
			technicalText: this.extractTechnicalText(error)
		};
	}

	private extractTechnicalText(error: any): string {
		try {
			if (error && error.message) {
				return error.message;
			} else {
				return JSON.stringify(error);
			}
		} catch (catchedError) {
			console.log(catchedError);
			return error.toString();
		}
	}

	complete() {
		// noop
	}
}

export interface MessageEvent {
	type: string,
	message?: any,
	messageCauses?: MessageCause[],
	target?: MessagesComponent | string
}

export interface MessageOptions {
	error?: any,
	target?: MessagesComponent | string
}
