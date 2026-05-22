import type { FieldErrors } from "@/lib/auth/types";
import { BIO_MAX, NAME_MAX } from "./types";

const URL_RE = /^https?:\/\/.+/;

export function validateProfile(data: {
    fullName: string;
    bio: string;
    githubUrl: string;
    gitlabUrl: string;
}): FieldErrors {
    const errors: FieldErrors = {};
    if (!data.fullName.trim()) {
        errors.fullName = "El nombre es obligatorio";
    } else if (data.fullName.trim().length < 2) {
        errors.fullName = "El nombre debe tener al menos 2 caracteres";
    } else if (data.fullName.length > NAME_MAX) {
        errors.fullName = `Máximo ${NAME_MAX} caracteres`;
    }

    if (data.bio.length > BIO_MAX) {
        errors.bio = `Máximo ${BIO_MAX} caracteres`;
    }

    if (data.githubUrl && !URL_RE.test(data.githubUrl)) {
        errors.githubUrl = "Debe empezar con http:// o https://";
    }
    if (data.gitlabUrl && !URL_RE.test(data.gitlabUrl)) {
        errors.gitlabUrl = "Debe empezar con http:// o https://";
    }

    return errors;
}