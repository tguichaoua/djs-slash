import { isRecord, isTypeof, TypeGuard } from '../utils/typeguard';

export interface GroupData {
    description?: string;
    defaultPermission?: boolean;
}

export const isGroupData = isRecord({
    description: isTypeof('string', 'undefined'),
    defaultPermission: isTypeof('boolean', 'undefined'),
}) as TypeGuard<GroupData>;
