import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const ProfilePage = () => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <>
            <Helmet>
                <title>Profile - Electronics Store</title>
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">My Profile</h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background-card border border-border rounded-xl p-8"
                    >
                        {/* Avatar */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                            <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-3xl font-bold text-accent">
                                {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-text-primary">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-text-muted">{user?.email || 'user@example.com'}</p>
                                <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                            </div>
                        </div>

                        {/* Form */}
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="First Name" defaultValue={user?.firstName || 'John'} />
                                <Input label="Last Name" defaultValue={user?.lastName || 'Doe'} />
                            </div>
                            <Input label="Email" type="email" defaultValue={user?.email || 'demo@example.com'} disabled />
                            <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="ghost">Cancel</Button>
                                <Button>Save Changes</Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-background-card border border-border rounded-xl p-8 mt-8"
                    >
                        <h2 className="text-xl font-bold text-text-primary mb-6">Change Password</h2>
                        <form className="space-y-4 max-w-md">
                            <Input label="Current Password" type="password" placeholder="Enter current password" />
                            <Input label="New Password" type="password" placeholder="Enter new password" />
                            <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
                            <Button>Update Password</Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
