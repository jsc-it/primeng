import { MessageSeverityEnum } from './../../../components/common/rc-api';
import { Message } from './../../../components/common/rc-api';

export const ERROR_MESSAGE: Message = { useCaseId: "This is a error message!", severity: MessageSeverityEnum.ERROR };
export const WARNING_MESSAGE: Message = { useCaseId: "This is a warning message!", severity: MessageSeverityEnum.WARN };
export const FATAL_MESSAGE: Message = { useCaseId: "This is a fatal error message!", severity: MessageSeverityEnum.FATAL };
export const INFO_MESSAGE_WITH_CAUSE: Message = { useCaseId: "This is an error message with one cause!", severity: MessageSeverityEnum.ERROR };
export const INFO_MESSAGE: Message = { useCaseId: "This is a info message!", severity: MessageSeverityEnum.INFO };
export const TARGET_BY_NAME: Message = { useCaseId: "This is a message with target specified by name", severity: MessageSeverityEnum.INFO };
export const TARGET_BY_INSTANCE: Message = { useCaseId: "This is a message with target specified by instance", severity: MessageSeverityEnum.INFO };
export const MESSAGE_ONE: Message = { useCaseId: "This is message one!", severity: MessageSeverityEnum.INFO };
export const MESSAGE_TWO: Message = { useCaseId: "This is message two!", severity: MessageSeverityEnum.INFO };