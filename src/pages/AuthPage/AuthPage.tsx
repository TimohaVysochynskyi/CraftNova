import css from "./AuthPage.module.css";

import { useLocation } from "react-router-dom";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper/AuthFormWrapper";
import ModelController from "../../components/auth/ModelController/ModelController";

export default function AuthPage() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/auth/login");

  return (
    <div className={css.container}>
      <div className={css.bgDark}></div>
      <div className={css.formWrapper}>
        <AuthFormWrapper isLoginPage={isLoginPage} />
      </div>
      <div className={css.modelWrapper}>
        <ModelController />
      </div>
    </div>
  );
}
