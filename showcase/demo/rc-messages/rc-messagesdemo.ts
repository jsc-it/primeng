import { Component, ViewChild } from '@angular/core';

import { TARGET_BY_NAME, INFO_MESSAGE, WARNING_MESSAGE, ERROR_MESSAGE, FATAL_MESSAGE, INFO_MESSAGE_WITH_CAUSE, MESSAGE_TWO, MESSAGE_ONE, TARGET_BY_INSTANCE } from './rc-messagesdemo.message';
import { MessagesComponent } from './../../../components/rc-messages/messages.component';
import { MessageSeverityEnum, MessageCause } from './../../../components/common/rc-api';
import { MessageService } from './../../../components/rc-messages/message.service';
import { Message } from '../../../components/common/rc-api';

@Component({
    templateUrl: 'showcase/demo/rc-messages/rc-messagesdemo.html'
})
export class RcMessagesDemo {

    @ViewChild('byInstanceMessageComponent') byInstanceMessageComponent: MessagesComponent;

    @ViewChild('showDifferentSeveritiesMessageComponent') showDifferentSeveritiesMessageComponent: MessagesComponent;

    @ViewChild('removeMsgComponent') removeMsgComponent: MessagesComponent;

    constructor(private messageService: MessageService) { }

    showInfo(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage(INFO_MESSAGE);
    }

    showWarn(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage(WARNING_MESSAGE);
    }

    showError(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage(ERROR_MESSAGE);
    }

    showFatal(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage(FATAL_MESSAGE);
    }

    showErrorWithOneCause(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage(INFO_MESSAGE_WITH_CAUSE, this.createMessageCause("myCause"));
    }

    removeInfoMsg(): void {
        this.messageService.removeMessage(INFO_MESSAGE);
    }


    showErrorWithMultipleCauses(): void {
        let causes: MessageCause[] = [];
        causes.push(this.createMessageCause("myCause1"));
        causes.push(this.createMessageCause("myCause2"));
        causes.push(this.createMessageCause("myCause3"));
        causes.push(this.createMessageCause("myCause4"));
        causes.push(this.createMessageCause("myCause5"));
        causes.push(this.createMessageCause("myCause6"));
        causes.push(this.createMessageCause("myCause7"));
        causes.push(this.createMessageCause("myCause8"));
        this.showDifferentSeveritiesMessageComponent.addMessage({ useCaseId: "This is an error message with multiple causes!", severity: MessageSeverityEnum.ERROR, messageCauses: causes });
    }

    showMessageByName(): void {
        this.messageService.addMessage(TARGET_BY_NAME, { target: "myName" });
    }

    showMessageByInstance(): void {
        this.byInstanceMessageComponent.addMessage(TARGET_BY_INSTANCE)
    }

    addMessageOne(): void {
        this.removeMsgComponent.addMessage(MESSAGE_ONE, { target: "myName" });
    }
    addMessageTwo(): void {
        this.removeMsgComponent.addMessage(MESSAGE_TWO, { target: "myName" });
    }

    removeMessageOne(): void {
        this.messageService.removeMessage(MESSAGE_ONE);
    }

    removeMessageTwo(): void {
        this.messageService.removeMessage(MESSAGE_TWO);
    }

    clear(): void {
        this.messageService.removeAllMessages();
    }
    private createMessageCause(cause: string): MessageCause {
        return { origin: "client", category: "mycategory", cause };
    }

}