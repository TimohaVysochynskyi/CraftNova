import { useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAuthLoading } from "../../../redux/hooks";
import { loginUser } from "../../../redux/slices/authSlice";
import type { LoginCredentials } from "../../../types/auth.types";
import css from "./AuthForm.module.css";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAuthLoading();

  const validationSchema = Yup.object({
    emailOrNickname: Yup.string()
      .trim()
      .min(3, "Поле повинно містити мінімум 3 символи")
      .required("Нікнейм або email обов'язковий"),
    password: Yup.string()
      .min(1, "Введіть пароль")
      .required("Пароль обов'язковий"),
  });

  const initialValues: LoginCredentials = {
    emailOrNickname: "",
    password: "",
  };

  const handleSubmit = async (values: LoginCredentials) => {
    const resultAction = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(resultAction)) {
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
          const fieldOrder = ["emailOrNickname", "password"];

          const firstError = fieldOrder.find(
            (field) =>
              touched[field as keyof typeof touched] &&
              errors[field as keyof typeof errors]
          );

          return (
            <Form autoComplete="off" className={css.form}>
              <div className={css.group}>
                <label className={css.label} htmlFor="emailOrNickname">
                  Нікнейм або електронна пошта
                </label>
                <Field
                  name="emailOrNickname"
                  type="text"
                  className={css.input}
                  autoComplete="username"
                  spellCheck={false}
                  placeholder="Player1234 або example@mail.com"
                />
              </div>

              <div className={css.group}>
                <label className={css.label} htmlFor="password">
                  Пароль
                </label>
                <Field
                  name="password"
                  type="password"
                  className={css.input}
                  autoComplete="current-password"
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
                {isLoading ? "ВХІД..." : "УВІЙТИ"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
