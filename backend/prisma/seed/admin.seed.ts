import { User } from '../../src/models';
import { UserRole } from '../../src/enums';

export const seedAdmin = async (): Promise<void> => {
    // Clear existing admins to ensure clean state with correct hashing
    await User.deleteMany({ email: { $in: ['admin@electronics-store.com', 'manager@electronics-store.com'] } });

    const admins = [
        {
            email: 'admin@electronics-store.com',
            password: 'Admin@123',
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.SUPER_ADMIN,
            isEmailVerified: true,
            isActive: true,
        },
        {
            email: 'manager@electronics-store.com',
            password: 'Manager@123',
            firstName: 'Store',
            lastName: 'Manager',
            role: UserRole.ADMIN,
            isEmailVerified: true,
            isActive: true,
        },
    ];

    for (const admin of admins) {
        await User.create(admin);
    }
    console.log(`   ✓ Created ${admins.length} admin users`);
};
