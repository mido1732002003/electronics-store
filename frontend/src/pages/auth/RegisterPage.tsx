import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/services/api';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });
            const { user, tokens } = response.data.data;

            dispatch(setCredentials({ user, tokens }));
            toast.success('Registration successful!');
            navigate('/');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Register - Electronics Store</title>
            </Helmet>

            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-background-card border border-border rounded-2xl shadow-card p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-text-primary mb-2 font-heading">
                                Create Account
                            </h1>
                            <p className="text-text-muted">Join us and start shopping today</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    placeholder="John"
                                    leftIcon={<HiOutlineUser size={20} />}
                                    error={errors.firstName?.message}
                                    {...register('firstName')}
                                />
                                <Input
                                    label="Last Name"
                                    placeholder="Doe"
                                    error={errors.lastName?.message}
                                    {...register('lastName')}
                                />
                            </div>

                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                leftIcon={<HiOutlineMail size={20} />}
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                leftIcon={<HiOutlineLockClosed size={20} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hover:text-accent"
                                    >
                                        {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                                    </button>
                                }
                                error={errors.password?.message}
                                helperText="8+ chars, uppercase, lowercase, number"
                                {...register('password')}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your password"
                                leftIcon={<HiOutlineLockClosed size={20} />}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />

                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" className="mt-1 rounded text-accent focus:ring-accent bg-background-secondary border-border" required />
                                <span className="text-sm text-text-secondary">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-accent hover:text-accent-400">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-accent hover:text-accent-400">Privacy Policy</Link>
                                </span>
                            </label>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-accent hover:text-accent-400 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default RegisterPage;
