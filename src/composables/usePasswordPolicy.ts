export type PasswordStrength = 0 | 1 | 2 | 3 | 4

export interface PasswordValidationResult {
    valid: boolean
    errors: string[]
    strength: PasswordStrength
}

export function usePasswordPolicy() {
    const minLength = 8

    const hasUppercase = (password: string): boolean => /[A-Z]/.test(password)
    const hasLowerCase = (password: string): boolean => /[a-z]/.test(password)
    const hasDigit = (password: string): boolean => /\d/.test(password)
    const hasSpecialChar = (password: string): boolean => /[^A-Za-z0-9]/.test(password)

    const getPasswordStrength = (password: string): PasswordStrength => {
        let score: PasswordStrength = 0
        if (password.length >= minLength) score++
        if (hasUppercase(password)) score ++
        if (hasLowerCase(password)) score ++
        if (hasDigit(password)) score ++
        if (hasSpecialChar(password)) score ++
        return Math.min(score, 4) as PasswordStrength
    }

    const validatePassword = (password: string): PasswordValidationResult => {
        const errors: string[] = []

        if (password.length < minLength) errors.push(`Au moins ${minLength} caracteres`)
        if (!hasUppercase(password)) errors.push("Au moins une majuscule")
        if (!hasLowerCase(password)) errors.push("Au moins une minuscule")
        if (!hasDigit(password)) errors.push("Au moins un chiffre : 0-9")
        if (!hasSpecialChar(password)) errors.push("Au moins un caractere special")

        return {
            valid: errors.length === 0,
            errors,
            strength: getPasswordStrength(password),
        }
    }

    return {
        validatePassword,
        getPasswordStrength,
    }
}


