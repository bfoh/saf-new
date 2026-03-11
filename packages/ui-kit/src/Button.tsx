import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    return (
        <button className={`saf-btn saf-btn-${variant} ${className || ''}`} {...props}>
            {children}
        </button>
    );
};
