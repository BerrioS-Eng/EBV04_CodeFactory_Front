import type { FieldErrors } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const PASSWORD_RULES = "Mínimo 8 caracteres, al menos 1 mayúscula y 1 número";

export function validateLogin(data: { email: string; password: string }): FieldErrors {
    const errors: FieldErrors = {};
    if (!data.email) errors.email = "Email requerido";
    else if (!EMAIL_RE.test(data.email)) errors.email = "Email inválido";
    if (!data.password) errors.password = "Contraseña requerida";
    return errors;
}

export function validateRegister(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    stack: string[];
}): FieldErrors {
    const errors: FieldErrors = {};
    if (!data.name || data.name.trim().length < 2) errors.name = "Nombre requerido (mín. 2 caracteres)";
    if (!data.email) errors.email = "Email requerido";
    else if (!EMAIL_RE.test(data.email)) errors.email = "Email inválido";
    if (!data.password) errors.password = "Contraseña requerida";
    else if (!PASSWORD_RE.test(data.password)) errors.password = PASSWORD_RULES;
    if (data.password !== data.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
    if (!data.stack.length) errors.stack = "Selecciona al menos una tecnología";
    return errors;
}
