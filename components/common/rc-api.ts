export interface LocalizationKey {
    key: string;
    translation?: string;
    enumName?: string;
}

export interface Message {
    localizationKey: string;
    severity: MessageSeverityEnum;
    messageCauses?: MessageCause[]
    openPopup?: boolean;
}


/** base class for implementing enums with Typesafe Enum Pattern (to be able to use enum names, instead of ordinal values, in a type-safe manner) */
export class EnumPatternBase {
    constructor(public name: string) { }
    toString() { return this.name; }
}

export class MessageSeverityEnum extends EnumPatternBase {
    static INFO = new MessageSeverityEnum('INFO');
    static WARN = new MessageSeverityEnum('WARN');
    static ERROR = new MessageSeverityEnum('ERROR');
    static FATAL = new MessageSeverityEnum('FATAL');

    constructor(name: string) { super(name); }
}


export interface MessageCause {
    messageId?: string;
    origin?: LocalizationKey;
    category: LocalizationKey;
    cause: LocalizationKey;
    remediation?: LocalizationKey;
    causeMessageParameters?: string[];
    remediationMessageParameters?: string[];
    technicalId?: string;
    technicalText?: string;
}

export interface MessageWithCauses {
    message: Message;
    messageCauses?: MessageCause[];
}