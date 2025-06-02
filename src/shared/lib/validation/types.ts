export type ValidationRule = {
    validate: (value: string) => boolean;
    message: string;
};

export type ValidationRules = {
    [key: string]: ValidationRule[];
};

export type ValidationResult = {
    isValid: boolean;
    error: string;
};

export type ValidationResults = {
    [key: string]: ValidationResult;
}; 
