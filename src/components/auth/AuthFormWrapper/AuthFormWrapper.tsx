import css from "./AuthFormWrapper.module.css";
import LoginForm from "../AuthForm/LoginForm";
import RegisterForm from "../AuthForm/RegisterForm";
import { forwardRef } from "react";

interface AuthFormWrapperProps {
  isLoginPage: boolean;
}

const AuthFormWrapper = forwardRef<HTMLDivElement, AuthFormWrapperProps>(
  ({ isLoginPage }, ref) => {
    return (
      <>
        <div className={css.container}>
          <div className={css.head}>
            <h1 className={css.title}>{isLoginPage ? "Вхід" : "Реєстрація"}</h1>
            <svg
              width="612"
              height="41"
              viewBox="0 0 612 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={css.headSVG}
            >
              <path d="M60 30.5H611.5" stroke="#CFB293" stroke-width="20" />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 0 20.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 20 40.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 40 40.5)"
                fill="#CFB293"
              />
            </svg>
          </div>
          <div className={css.formWrapper} ref={ref}>
            <div className={css.form}>
              {isLoginPage ? <LoginForm /> : <RegisterForm />}
            </div>

            <svg
              width="1264"
              height="718"
              viewBox="0 0 1264 718"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={css.formCardSVG}
              preserveAspectRatio="none"
            >
              <rect
                data-figma-bg-blur-radius="7"
                x="40"
                y="40.5"
                width="1184"
                height="637"
                fill="#4D3E2B"
                fill-opacity="0.6"
                stroke="#CFB293"
                stroke-width="20"
              />
              <rect x="1234" y="10.5" width="20" height="20" fill="#CFB293" />
              <rect x="1234" y="687.5" width="20" height="20" fill="#CFB293" />
              <rect x="10" y="687.5" width="20" height="20" fill="#CFB293" />
              <rect x="10" y="10.5" width="20" height="20" fill="#CFB293" />
              <rect x="1117" y="379.5" width="20" height="20" fill="#CFB293" />
              <rect x="1117" y="399.5" width="20" height="20" fill="#CFB293" />
              <rect x="1097" y="419.5" width="20" height="20" fill="#CFB293" />
              <rect x="1137" y="419.5" width="20" height="20" fill="#CFB293" />
              <rect x="1117" y="439.5" width="20" height="20" fill="#CFB293" />
              <rect x="1117" y="459.5" width="20" height="20" fill="#CFB293" />
              <rect x="115" y="189.5" width="20" height="20" fill="#CFB293" />
              <rect x="115" y="209.5" width="20" height="20" fill="#CFB293" />
              <rect x="95" y="229.5" width="20" height="20" fill="#CFB293" />
              <rect x="135" y="229.5" width="20" height="20" fill="#CFB293" />
              <rect x="115" y="249.5" width="20" height="20" fill="#CFB293" />
              <rect x="115" y="269.5" width="20" height="20" fill="#CFB293" />
              <rect x="1129" y="70.5" width="20" height="20" fill="#CFB293" />
              <rect x="1069" y="70.5" width="20" height="20" fill="#CFB293" />
              <rect x="1129" y="190.5" width="20" height="20" fill="#CFB293" />
              <rect x="1109" y="90.5" width="20" height="20" fill="#CFB293" />
              <rect x="1109" y="110.5" width="20" height="20" fill="#CFB293" />
              <rect x="1129" y="130.5" width="20" height="20" fill="#CFB293" />
              <rect x="1149" y="130.5" width="20" height="20" fill="#CFB293" />
              <rect x="1169" y="110.5" width="20" height="20" fill="#CFB293" />
              <rect x="1169" y="90.5" width="20" height="20" fill="#CFB293" />
              <rect x="1149" y="50.5" width="20" height="20" fill="#CFB293" />
              <rect x="1169" y="50.5" width="20" height="20" fill="#CFB293" />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 135 70.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 194 70.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 135 189.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 155 90.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 155 110.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 135 130.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 115 130.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 95 110.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 95 90.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 115 50.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(-1 0 0 1 95 50.5)"
                fill="#CFB293"
              />
              <rect
                x="134"
                y="647.5"
                width="19"
                height="20"
                transform="rotate(180 134 647.5)"
                fill="#CFB293"
              />
              <rect
                x="194"
                y="647.5"
                width="20"
                height="20"
                transform="rotate(180 194 647.5)"
                fill="#CFB293"
              />
              <rect
                x="134"
                y="528.5"
                width="19"
                height="20"
                transform="rotate(180 134 528.5)"
                fill="#CFB293"
              />
              <rect
                x="154"
                y="627.5"
                width="20"
                height="20"
                transform="rotate(180 154 627.5)"
                fill="#CFB293"
              />
              <rect
                x="154"
                y="608.5"
                width="20"
                height="20"
                transform="rotate(180 154 608.5)"
                fill="#CFB293"
              />
              <rect
                x="134"
                y="588.5"
                width="20"
                height="20"
                transform="rotate(180 134 588.5)"
                fill="#CFB293"
              />
              <rect
                x="115"
                y="588.5"
                width="20"
                height="20"
                transform="rotate(180 115 588.5)"
                fill="#CFB293"
              />
              <rect
                x="95"
                y="608.5"
                width="20"
                height="20"
                transform="rotate(180 95 608.5)"
                fill="#CFB293"
              />
              <rect
                x="95"
                y="627.5"
                width="20"
                height="20"
                transform="rotate(180 95 627.5)"
                fill="#CFB293"
              />
              <rect
                x="115"
                y="667.5"
                width="20"
                height="20"
                transform="rotate(180 115 667.5)"
                fill="#CFB293"
              />
              <rect
                x="95"
                y="667.5"
                width="20"
                height="20"
                transform="rotate(180 95 667.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1129 647.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1069 647.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1129 529.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1109 627.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1109 607.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1129 587.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1149 587.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1169 607.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1169 627.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1149 667.5)"
                fill="#CFB293"
              />
              <rect
                width="20"
                height="20"
                transform="matrix(1 0 0 -1 1169 667.5)"
                fill="#CFB293"
              />
              <defs>
                <clipPath
                  id="bgblur_0_32_847_clip_path"
                  transform="translate(-23 -23.5)"
                >
                  <rect x="40" y="40.5" width="1184" height="637" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </>
    );
  }
);

export default AuthFormWrapper;
