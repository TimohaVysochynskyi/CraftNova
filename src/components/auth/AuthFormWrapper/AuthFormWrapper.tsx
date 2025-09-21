import css from "./AuthFormWrapper.module.css";
import LoginForm from "../AuthForm/LoginForm";
import RegisterForm from "../AuthForm/RegisterForm";
import AdaptiveSVGBackground from "../AdaptiveSVGBackground/AdaptiveSVGBackground";
import AdaptiveHeaderSVG from "../AdaptiveHeaderSVG/AdaptiveHeaderSVG";
import { useContainerDimensions } from "../../../hooks/useContainerDimensions";

interface AuthFormWrapperProps {
  isLoginPage: boolean;
}

export default function AuthFormWrapper({ isLoginPage }: AuthFormWrapperProps) {
  const [svgContainerRef, { width, height }] = useContainerDimensions();
  const [mainContainerRef, { width: mainWidth }] = useContainerDimensions();

  const calculateSquareSize = (containerWidth: number) => {
    const baseSquareSize = 20;
    const minWidthForFullSize = 768;

    if (containerWidth >= minWidthForFullSize) {
      return baseSquareSize;
    } else {
      const scaleFactor = containerWidth / minWidthForFullSize;
      return Math.max(8, Math.floor(baseSquareSize * scaleFactor));
    }
  };

  const squareSize = width > 0 ? calculateSquareSize(width) : 20;
  const formMargin = squareSize * 2;

  return (
    <>
      <div className={css.container} ref={mainContainerRef}>
        <div className={css.head}>
          <h1 className={css.title}>{isLoginPage ? "Вхід" : "Реєстрація"}</h1>
          <div className={css.headerSvgContainer}>
            {mainWidth > 0 && (
              <AdaptiveHeaderSVG width={mainWidth} className={css.headSVG} />
            )}
          </div>
        </div>
        <div
          className={css.formWrapper}
          style={{
            paddingLeft: `${formMargin}px`,
            paddingRight: `${formMargin}px`,
          }}
        >
          <div className={css.form}>
            {isLoginPage ? <LoginForm /> : <RegisterForm />}
          </div>

          <div ref={svgContainerRef} className={css.svgContainer}>
            {width > 0 && height > 0 && (
              <AdaptiveSVGBackground
                width={width}
                height={height}
                className={css.formCardSVG}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
