import { Field } from "formik";
import css from "./FormElements.module.css";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  spellCheck?: boolean;
  maxLength?: number;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "file";
}

interface FormGroupProps {
  children: React.ReactNode;
}

export function FormGroup({ children }: FormGroupProps) {
  return <div className={css.group}>{children}</div>;
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete = "off",
  spellCheck = false,
  maxLength,
  onKeyPress,
  onChange,
}: FormInputProps) {
  return (
    <FormGroup>
      {label && (
        <label className={css.label} htmlFor={name}>
          {label}
        </label>
      )}
      <Field name={name}>
        {({ field, form }: any) => (
          <input
            {...field}
            type={type}
            className={css.input}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            placeholder={placeholder}
            maxLength={maxLength}
            onKeyPress={onKeyPress}
            onChange={(e) => {
              if (onChange) {
                onChange(e);
              }
              form.setFieldValue(name, e.target.value);
            }}
          />
        )}
      </Field>
    </FormGroup>
  );
}

export function FormButton({
  type = "button",
  onClick,
  disabled = false,
  children,
  variant = "primary",
}: FormButtonProps) {
  const getClassName = () => {
    switch (variant) {
      case "secondary":
        return css.buttonSecondary;
      case "file":
        return css.buttonFile;
      default:
        return css.button;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getClassName()}
    >
      {children}
    </button>
  );
}

interface FormErrorProps {
  error?: string;
}

export function FormError({ error }: FormErrorProps) {
  return (
    <div className={css.errorContainer}>
      {error && <div className={css.error}>{error}</div>}
    </div>
  );
}
