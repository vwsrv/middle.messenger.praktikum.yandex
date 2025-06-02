import { ValidationRule, ValidationResult, ValidationResults } from './types';
import { VALIDATION_RULES } from './constants';

export class Validator {
    private static validateField(value: string, rules: ValidationRule[]): ValidationResult {
        for (const rule of rules) {
            if (!rule.validate(value)) {
                return {
                    isValid: false,
                    error: rule.message
                };
            }
        }

        return {
            isValid: true,
            error: ''
        };
    }

    public static validateFieldByName(fieldName: string, value: string): ValidationResult {
        const rules = VALIDATION_RULES[fieldName];

        if (!rules) {
            return {
                isValid: true,
                error: ''
            };
        }

        return this.validateField(value, rules);
    }

    public static validateForm(formData: Record<string, string>): ValidationResults {
        const results: ValidationResults = {};

        for (const [fieldName, value] of Object.entries(formData)) {
            results[fieldName] = this.validateFieldByName(fieldName, value);
        }

        return results;
    }

    public static isFormValid(results: ValidationResults): boolean {
        return Object.values(results).every((result) => result.isValid);
    }
} 
