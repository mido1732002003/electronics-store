import React from 'react';
import { cn } from '@/utils/helpers';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    sizeClasses[size],
                    'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600'
                )}
            />
        </div>
    );
};

export default LoadingSpinner;
