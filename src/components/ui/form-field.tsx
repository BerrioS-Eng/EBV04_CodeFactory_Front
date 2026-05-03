import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    hint?: string;
    count?: string;
    className?: string;
    labelClassName?: string;
    children: React.ReactNode;
}

export function FormField({
    label,
    htmlFor,
    required,
    error,
    hint,
    count,
    className,
    labelClassName,
    children,
}: FormFieldProps) {
    const showFooter = Boolean(error || hint || count);
    return (
        <Field className={className} data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor={htmlFor} className={cn("text-foreground/80", labelClassName)}>
                {label}
                {required && <span className="text-primary">*</span>}
            </FieldLabel>
            {children}
            {showFooter && (
                <div className="flex items-center justify-between gap-2 text-xs">
                    {error ? (
                        <FieldError className="text-xs">{error}</FieldError>
                    ) : hint ? (
                        <FieldDescription className="text-xs">{hint}</FieldDescription>
                    ) : (
                        <span aria-hidden />
                    )}
                    {count && <span className="text-muted-foreground">{count}</span>}
                </div>
            )}
        </Field>
    );
}
