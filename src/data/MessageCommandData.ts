import { MessageCommandCallback } from '../MessageCommandCallback';
import { isRecord, isTypeof, TypeGuard } from '../utils/typeguard';

export interface MessageCommandData {
    readonly callback: MessageCommandCallback;
    readonly defaultPermission: boolean | undefined;
}

export const isMessageCommandData = isRecord({
    callback: isTypeof('function'),
    defaultPermission: isTypeof('boolean', 'undefined'),
}) as TypeGuard<MessageCommandData>;
