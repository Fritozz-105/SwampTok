/**
 * Calculate a person's age based on their date of birth
 * @param dob Date of birth as string in YYYY-MM-DD format
 * @returns Age in years
 */
export const calculateAge = (dob: string): number => {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
