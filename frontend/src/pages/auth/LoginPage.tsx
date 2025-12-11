import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/services/api';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            const { user, tokens } = response.data.data;

            dispatch(setCredentials({ user, tokens }));
            toast.success('Login successful!');
            navigate('/');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login - Electronics Store</title>
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
                                Welcome Back
                            </h1>
                            <p className="text-text-muted">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                placeholder="Enter your password"
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
                                {...register('password')}
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-accent focus:ring-accent bg-background-secondary border-border" />
                                    <span className="text-text-secondary">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-accent hover:text-accent-400">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-background-card text-text-muted">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" className="w-full">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                                    Google
                                </Button>
                                <Button variant="outline" type="button" className="w-full">
                                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                                    Facebook
                                </Button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-accent hover:text-accent-400 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default LoginPage;
