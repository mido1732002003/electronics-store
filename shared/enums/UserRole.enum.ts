export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

export const UserRoleLabel: Record<UserRole, string> = {
    [UserRole.CUSTOMER]: 'Customer',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.SUPER_ADMIN]: 'Super Admin',
};
