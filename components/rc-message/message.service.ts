import { MessageCause } from './../common/rc-api';
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { Response } from "@angular/http";
import { Message } from '../common/rc-api';


/**
 * Service that handles {@link Messages}.
 * @see XSP Message handling Concept
 * https://s415vmmt060.detss.corpintra.net/confluence/pages/viewpage.action?pageId=21106578
 * 
 * @author Johannes Schlaudraff (NovaTec Consulting GmbH)
 */
@Injectable()
export class MessageService {

	private displayedMessages: Message[] = [];

	private uiMessageSource: Subject<Message> = new Subject<Message>();
	private uiMessageSourceStream: Observable<Message> = this.uiMessageSource.asObservable();

	private uiMessageDeleted: Subject<Message> = new Subject<Message>();
	private uiMessageDeletedStream: Observable<Message> = this.uiMessageDeleted.asObservable();

	/**
	 * Returns a function that handles an error.
	 * 
	 * @param {@link Message} the message.
	 * @returns function
	 */
	public handleErrorFn(message: Message): any {
		return (error: any) => {
			this.addMessage(message, error);
		};
	}

	/**
	 * Adds a message if not already added.
	 * 
	 * @param {string} useCaseId the use case id
	 * @returns a function
	 */
	public addMessage(messageToAdd: Message, error: any = undefined): any {
		console.log("addMessage", messageToAdd, error);
		let message: Message = this.contains(messageToAdd);
		if (message) { // message already displayed?
			this.addMessageCause(message, error); // add only cause
		} else {
			this.addMessageCause(message, error);
			this.displayedMessages.push(message);
			this.publishMessage(message);
		}
	}

	private addMessageCause(message: Message, messageCause: any): void {
		if (messageCause) {
			if (!message.messageCauses) {
				message.messageCauses = [];
			}
			message.messageCauses.push(this.transformToMessageCause(messageCause));
		}
	}
	private transformToMessageCause(error: any): MessageCause {
		// comes the error unwrapped from the server?
		if (error instanceof Response) {
			error = error.json();
		}
		// is the error an MessageCause instance?
		if (error.hasOwnProperty("cause")) {
			return error;
		}
		// no MessageCause then we return a default messageCause
		return {
			category: { key: "sbb.ri.erepko.main.IntegratedWorkshop.Messages.OtherError" },
			cause: { key: "sbb.ri.erepko.main.IntegratedWorkshop.Messages.UnknownError" },
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


	private contains(message: Message): Message {
		for (let index: number = 0; index < this.displayedMessages.length; index++) {
			if (this.displayedMessages[index] === message) {
				return this.displayedMessages[index];
			}
		}
		return undefined;
	}


	/**
	 * Resets a ui message.
	 * 
	 * @param {IUiMessage} the message to reset
	 */
	public resetUiMessage(message: Message): void {
		let foundMessage: Message = this.contains(message);
		let index: number = this.displayedMessages.indexOf(foundMessage);
		if (index > -1) {
			this.displayedMessages.splice(index, 1);
			this.publishRemovalOfMessage(foundMessage);
		}
	}

	private publishMessage(message: Message): void {
		this.uiMessageSource.next(message);
	}

	private publishRemovalOfMessage(message: Message): void {
		this.uiMessageDeleted.next(message);
	}

	/**
	 * Removes all messages.
	 */
	public resetAllUiMessages(): void {
		for (let index: number = 0; index < this.displayedMessages.length; index++) {
			this.publishRemovalOfMessage(this.displayedMessages[index]);
		}
		this.displayedMessages = [];
	}

	/**
	 * Gets the ui message stream of newly added messages.
	 * 
	 * @returns {Observable<Message>}
	 */
	public addedUiMessages(): Observable<Message> {
		return this.uiMessageSourceStream;
	}

	/**
	 * Gets the ui message stream of newly deleted messages.
	 * 
	 * @returns {Observable<Message>}
	 */
	public deletedUiMessages(): Observable<Message> {
		return this.uiMessageDeletedStream;
	}

}