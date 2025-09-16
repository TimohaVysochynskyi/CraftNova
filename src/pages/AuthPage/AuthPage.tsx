import css from "./AuthPage.module.css";

import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper/AuthFormWrapper";
import ModelController from "../../components/auth/ModelController/ModelController";

export default function AuthPage() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [formWrapperHeight, setFormWrapperHeight] = useState<number>(0);

  // Відстеження висоти formWrapper з AuthFormWrapper
  useEffect(() => {
    const updateHeight = () => {
      if (formWrapperRef.current) {
        const height = formWrapperRef.current.offsetHeight;
        setFormWrapperHeight(height);
        console.log("FormWrapper height:", height);
      }
    };

    // Оновлюємо висоту при монтуванні
    updateHeight();

    // Створюємо ResizeObserver для відстеження змін розміру
    const resizeObserver = new ResizeObserver(updateHeight);
    if (formWrapperRef.current) {
      resizeObserver.observe(formWrapperRef.current);
    }

    // Також слухаємо зміни вікна
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className={css.container}>
      <div className={css.bgDark}></div>
      <div className={css.formWrapper}>
        <AuthFormWrapper isLoginPage={isLoginPage} ref={formWrapperRef} />
      </div>
      <div className={css.modelWrapper}>
        <ModelController height={formWrapperHeight} />
      </div>
    </div>
  );
}
