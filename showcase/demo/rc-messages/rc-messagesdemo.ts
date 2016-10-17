import { Component, ViewChild } from '@angular/core';

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
        this.showDifferentSeveritiesMessageComponent.addMessage(<Message>{ useCaseId: "This is a info message!", severity: MessageSeverityEnum.INFO });
    }

    showWarn(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage({ useCaseId: "This is a warning message!", severity: MessageSeverityEnum.WARN });
    }

    showError(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage({ useCaseId: "This is a error message!", severity: MessageSeverityEnum.ERROR });
    }

    showFatal(): void {
        this.showDifferentSeveritiesMessageComponent.addMessage({ useCaseId: "This is a fatal error message!", severity: MessageSeverityEnum.FATAL });
    }

    showErrorWithOneCause(): void {
        let causes: MessageCause[] = [];
        causes.push(this.createMessageCause("myCause"));
        this.showDifferentSeveritiesMessageComponent.addMessage({ useCaseId: "This is an error message with one cause!", severity: MessageSeverityEnum.ERROR, messageCauses: causes });
    }

    removeInfoMsg(): void {
        this.messageService.removeMessage(<Message>{ useCaseId: "This is a info message!", severity: MessageSeverityEnum.INFO });
    }


    showErrorWithMultipleOneCauses(): void {
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

    clear(): void {
        this.messageService.removeAllMessages();
    }

    showMessageByName(): void {
        this.messageService.addMessage(<Message>{ useCaseId: "This is a message with target specified by name", severity: MessageSeverityEnum.INFO }, { target: "myName" });
    }

    showMessageByInstance(): void {
        this.byInstanceMessageComponent.addMessage(<Message>{ useCaseId: "This is a message with target specified by instance", severity: MessageSeverityEnum.INFO })
    }

    addMessageOne(): void {
        this.removeMsgComponent.addMessage(<Message>{ useCaseId: "This is message one!", severity: MessageSeverityEnum.INFO }, { target: "myName" });
    }
    addMessageTwo(): void {
        this.removeMsgComponent.addMessage(<Message>{ useCaseId: "This is message two!", severity: MessageSeverityEnum.ERROR }, { target: "myName" });
    }

    removeMessageOne(): void {
        this.messageService.removeMessage(<Message>{ useCaseId: "This is message one!", severity: MessageSeverityEnum.INFO });
    }

    removeMessageTwo(): void {
        this.messageService.removeMessage(<Message>{ useCaseId: "This is message two!", severity: MessageSeverityEnum.ERROR });
    }


    private createMessageCause(cause: string): MessageCause {
        return { origin: "client", category: "mycategory", cause };
    }

}