import { z } from 'zod';

/**
 * Validates data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @param setErrors Optional function to set error messages
 * @returns Object with validation result and errors if any
 */
export const validateAuth = <T extends z.ZodSchema>(
    schema: T,
    data: unknown,
    setErrors?: (errors: Record<string, string>) => void
): { isValid: boolean; errors?: Record<string, string> } => {
    try {
        schema.parse(data);
        if (setErrors) {
            setErrors({});
        }
        return { isValid: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach(err => {
                if (err.path[0]) {
                    formattedErrors[err.path[0] as string] = err.message;
                }
            });

            if (setErrors) {
                setErrors(formattedErrors);
            }

            return { isValid: false, errors: formattedErrors };
        }
        return { isValid: false };
    }
};
