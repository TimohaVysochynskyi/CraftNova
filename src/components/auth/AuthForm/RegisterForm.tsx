import { useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAuthLoading } from "../../../redux/hooks";
import { registerUser } from "../../../redux/slices/authSlice";
import type { RegisterCredentials } from "../../../types/auth.types";
import css from "./AuthForm.module.css";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAuthLoading();

  const validationSchema = Yup.object({
    nickname: Yup.string()
      .trim()
      .min(3, "Нікнейм повинен містити мінімум 3 символи")
      .max(16, "Нікнейм не повинен перевищувати 16 символів")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Нікнейм може містити лише англійські літери, цифри та _"
      )
      .required("Нікнейм обов'язковий"),
    email: Yup.string()
      .trim()
      .email("Введіть коректний email")
      .required("Email обов'язковий"),
    password: Yup.string()
      .min(8, "Пароль повинен містити мінімум 8 символів")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
        "Пароль повинен містити велику літеру, малу літеру, цифру та спецсимвол"
      )
      .required("Пароль обов'язковий"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Паролі не збігаються")
      .required("Підтвердіть пароль"),
  });

  const initialValues: RegisterCredentials = {
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: RegisterCredentials) => {
    const resultAction = await dispatch(registerUser(values));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {({ errors, touched }) => {
          const fieldOrder = [
            "nickname",
            "email",
            "password",
            "confirmPassword",
          ];

          const firstError = fieldOrder.find(
            (field) =>
              touched[field as keyof typeof touched] &&
              errors[field as keyof typeof errors]
          );

          return (
            <Form autoComplete="off" className={css.form}>
              <div className={css.group}>
                <label className={css.label} htmlFor="nickname">
                  Придумайте нікнейм
                </label>
                <Field
                  name="nickname"
                  type="text"
                  className={css.input}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Player1234"
                />
              </div>

              <div className={css.group}>
                <label className={css.label} htmlFor="email">
                  Введіть вашу електронну пошту
                </label>
                <Field
                  name="email"
                  type="email"
                  className={css.input}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="player1234@example.com"
                />
              </div>

              <div className={css.group}>
                <label className={css.label} htmlFor="password">
                  Придумайте пароль
                </label>
                <Field
                  name="password"
                  type="new-password"
                  className={css.input}
                  placeholder="********"
                />
              </div>

              <div className={css.group}>
                <label className={css.label} htmlFor="confirmPassword">
                  Повторіть пароль
                </label>
                <Field
                  name="confirmPassword"
                  type="new-password"
                  className={css.input}
                  placeholder="********"
                />
              </div>

              <div className={css.errorContainer}>
                {firstError && (
                  <div className={css.error}>
                    {errors[firstError as keyof typeof errors]}
                  </div>
                )}
              </div>

              <button type="submit" className={css.button} disabled={isLoading}>
                {isLoading ? "СТВОРЕННЯ..." : "ВІДПРАВИТИ"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
