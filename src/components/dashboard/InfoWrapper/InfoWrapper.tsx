import type { ApplicationResponse } from "../../../api/applicationApi";
import type { User } from "../../../types/auth.types";
import css from "./InfoWrapper.module.css";

interface InfoWrapperProps {
  user: User;
  application: ApplicationResponse | null;
  isApplicationLoading: boolean;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

const numberFormatter = new Intl.NumberFormat("uk-UA");
const dateTimeFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return dateTimeFormatter.format(parsed);
};

const formatUserId = (id?: number) => {
  if (typeof id !== "number") {
    return "—";
  }
  return `#${id.toString().padStart(8, "0")}`;
};

export default function InfoWrapper({
  user,
  application,
  isApplicationLoading,
  onLogout,
  onOpenAdmin,
}: InfoWrapperProps) {
  const displayName =
    [user.name, user.surname].filter(Boolean).join(" ").trim() || user.username;
  const email = user.email || "—";
  const formattedUserId = formatUserId(user.id);
  const gamePoints =
    typeof user.gamePoints === "number"
      ? numberFormatter.format(user.gamePoints)
      : "—";
  const balanceValue =
    typeof user.balance === "number"
      ? `${numberFormatter.format(user.balance)} ₴`
      : "—";
  const isOnline = Boolean(user.isOnline);
  const statusLabel = isOnline ? "Онлайн" : "Не в мережі";
  const statusClass = isOnline ? css.statusOnline : css.statusOffline;

  const isApproved = application?.status === "approved";
  const isPending = application?.status === "pending";
  const isVerified = Boolean(user.passportValid || isApproved);
  const verificationDate =
    application?.processedAt ??
    application?.updatedAt ??
    application?.createdAt;

  const adminButton = onOpenAdmin ? (
    <button
      type="button"
      className={`${css.actionButton} ${css.adminButton}`}
      onClick={onOpenAdmin}
    >
      Адмін-панель
    </button>
  ) : null;

  const showVerificationInfo =
    !isApplicationLoading && (isVerified || isPending);
  const verificationTitle = "Верифікація пройдена:";
  const verificationValue = isPending
    ? "Анкета на перевірці адміністрації"
    : formatDateTime(verificationDate) ?? "Дата недоступна";

  return (
    <div className={css.container}>
      <button
        type="button"
        className={css.logoutButton}
        onClick={onLogout}
        aria-label="Вийти з акаунта"
      >
        <svg
          className={css.logoutIcon}
          viewBox="0 0 43 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.34802 0C5.53181 0 3.78999 0.718342 2.50574 1.997C1.22149 3.27566 0.5 5.00989 0.5 6.81818V33.1818C0.5 34.9901 1.22149 36.7243 2.50574 38.003C3.78999 39.2817 5.53181 40 7.34802 40H26.5225C26.8857 40 27.2341 39.8563 27.4909 39.6006C27.7478 39.3449 27.8921 38.998 27.8921 38.6364C27.8921 38.2747 27.7478 37.9279 27.4909 37.6721C27.2341 37.4164 26.8857 37.2727 26.5225 37.2727H7.34802C6.2583 37.2727 5.2132 36.8417 4.44265 36.0745C3.6721 35.3073 3.23921 34.2668 3.23921 33.1818V6.81818C3.23921 5.73321 3.6721 4.69267 4.44265 3.92547C5.2132 3.15828 6.2583 2.72727 7.34802 2.72727H26.5225C26.8857 2.72727 27.2341 2.5836 27.4909 2.32787C27.7478 2.07214 27.8921 1.7253 27.8921 1.36364C27.8921 1.00198 27.7478 0.655131 27.4909 0.3994C27.2341 0.143668 26.8857 0 26.5225 0H7.34802ZM32.0557 9.03636C31.9303 8.90239 31.7791 8.79493 31.6111 8.7204C31.4431 8.64587 31.2617 8.60579 31.0778 8.60256C30.8939 8.59933 30.7113 8.63301 30.5407 8.7016C30.3702 8.77018 30.2153 8.87226 30.0852 9.00175C29.9552 9.13124 29.8526 9.28548 29.7837 9.45528C29.7149 9.62507 29.681 9.80694 29.6843 9.99004C29.6875 10.1731 29.7278 10.3537 29.8026 10.521C29.8775 10.6883 29.9854 10.8388 30.12 10.9636L37.8263 18.6364H12.8264C12.4632 18.6364 12.1148 18.78 11.858 19.0358C11.6011 19.2915 11.4568 19.6383 11.4568 20C11.4568 20.3617 11.6011 20.7085 11.858 20.9642C12.1148 21.22 12.4632 21.3636 12.8264 21.3636H37.8263L30.12 29.0364C29.9854 29.1612 29.8775 29.3117 29.8026 29.479C29.7278 29.6463 29.6875 29.8269 29.6843 30.01C29.681 30.1931 29.7149 30.3749 29.7837 30.5447C29.8526 30.7145 29.9552 30.8688 30.0852 30.9983C30.2153 31.1277 30.3702 31.2298 30.5407 31.2984C30.7113 31.367 30.8939 31.4007 31.0778 31.3974C31.2617 31.3942 31.4431 31.3541 31.6111 31.2796C31.7791 31.2051 31.9303 31.0976 32.0557 30.9636L42.0995 20.9636C42.3559 20.708 42.5 20.3614 42.5 20C42.5 19.6386 42.3559 19.292 42.0995 19.0364L32.0557 9.03636Z"
            fill="#CFB293"
          />
        </svg>
      </button>
      <h2 className={css.title}>Біо та інформація</h2>
      <div className={css.topInfo}>
        <div className={css.infoCol}>
          <div className={css.infoField}>
            <p className={css.label}>Ім’я</p>
            <span className={css.infoText}>{displayName}</span>
          </div>
          <hr className={css.line} />
          <div className={css.infoField}>
            <p className={css.label}>Електронна пошта</p>
            <span className={css.infoText}>{email}</span>
          </div>
        </div>
        <div className={css.infoCol}>
          <div className={css.infoField}>
            <p className={css.label}>Ігровий номер</p>
            <span className={`${css.infoText} ${css.infoNumber}`}>
              {formattedUserId}
            </span>
          </div>
        </div>
      </div>
      <hr className={css.line} />
      <div className={css.bottomInfo}>
        <div className={css.infoGroup}>
          <p className={css.label}>Ігрових балів</p>
          <span className={css.infoText}>{gamePoints}</span>
        </div>
        <div className={css.infoGroup}>
          <p className={css.label}>Баланс</p>
          <span className={css.infoText}>{balanceValue}</span>
        </div>
        <div className={css.infoGroup}>
          <p className={css.label}>Статус</p>
          <span className={`${css.infoText} ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <hr className={css.line} />

      {showVerificationInfo && (
        <div className={css.verifyWrapper}>
          <p className={`${css.label} ${css.verifyTitle}`}>
            {verificationTitle}
          </p>
          <span className={`${css.infoText} ${css.verifyStatus}`}>
            {verificationValue}
          </span>
        </div>
      )}
      {adminButton ? (
        <div className={css.verifyActions}>{adminButton}</div>
      ) : null}
    </div>
  );
}
