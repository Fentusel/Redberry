const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
    username: (v) => (v.trim().length >= 3 ? "" : "At least 3 characters"),
    email: (v) => (EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email"),
    password: (v) => (v.length >= 3 ? "" : "At least 3 characters"),
    confirmPassword: (v, all) => (v === all.password && v ? "" : "Passwords do not match"),
};

export function validate(values, fields) {
    const errors = {};
    fields.forEach((f) => {
        const msg = validators[f](values[f], values);
        if (msg) errors[f] = msg;
    });
    return errors;
}