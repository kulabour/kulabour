import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`}
                style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: variant === 'default' ? '#0078D4' : 'transparent',
                    color: variant === 'default' ? 'white' : '#0F172A',
                    border: variant === 'outline' ? '1px solid #E2E8F0' : 'none',
                    cursor: 'pointer'
                }}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
