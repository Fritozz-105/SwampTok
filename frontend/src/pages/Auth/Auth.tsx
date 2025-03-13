import { z } from 'zod';

// Define the SignUp schema
export const SignUpSchema = z.object({
    fullName: z.string().min(2, 'Please enter your full name (minimum 2 characters)'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[!@#$%^&*]/, 'Password must contain at least 1 symbol'),
    confirmPassword: z.string(),
    dateOfBirth: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
}).refine(data => {
    if (!data.dateOfBirth) return false;

    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return false;
    if (birthDate > today) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 17;
}, {
    message: 'You must be at least 17 years old to sign up',
    path: ['dateOfBirth']
});

// Define the Login schema
export const LoginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
