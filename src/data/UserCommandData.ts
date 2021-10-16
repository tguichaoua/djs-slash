import { UserCommandCallback } from '../UserCommandCallback';
import { isRecord, isTypeof, TypeGuard } from '../utils/typeguard';

export interface UserCommandData {
    callback: UserCommandCallback;
    readonly defaultPermission: boolean | undefined;
}

export const isUserCommandData = isRecord({
    callback: isTypeof('function'),
    defaultPermission: isTypeof('boolean', 'undefined'),
}) as TypeGuard<UserCommandData>;
