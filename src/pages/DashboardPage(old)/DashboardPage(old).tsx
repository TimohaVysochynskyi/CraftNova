import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useUser } from "../../redux/hooks";
import { logoutUser } from "../../redux/slices/authSlice";
import { getMyApplication } from "../../redux/slices/applicationSlice";
import css from "./DashboardPage.module.css";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const { application, isLoading } = useAppSelector(
    (state) => state.application
  );

  useEffect(() => {
    // Завантажуємо анкету при завантаженні сторінки
    dispatch(getMyApplication());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
  };

  if (!user) {
    return null;
  }

  // Визначаємо чи показувати блок верифікації
  const showVerificationBanner = !user.passportValid;
  const isApplicationPending = application?.status === "pending";
  const isApplicationRejected = application?.status === "rejected";

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>Дашборд</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {user.isAdmin && (
            <button
              onClick={() => navigate("/admin/applications")}
              className={css.logoutButton}
              style={{ background: "#2563eb" }}
            >
              Адмін-панель
            </button>
          )}
          <button onClick={handleLogout} className={css.logoutButton}>
            Вийти
          </button>
        </div>
      </div>

      {/* Блок верифікації */}
      {showVerificationBanner && (
        <div
          className={`${css.verificationBanner} ${
            isApplicationRejected
              ? css.rejected
              : isApplicationPending
              ? css.pending
              : css.notStarted
          }`}
        >
          {isLoading ? (
            <p className={css.bannerText}>Завантаження...</p>
          ) : isApplicationPending ? (
            <>
              <p className={css.bannerText}>
                ⏳ Ваша анкета на розгляді. Очікуйте підтвердження від
                адміністрації.
              </p>
            </>
          ) : isApplicationRejected ? (
            <>
              <p className={css.bannerText}>
                ❌ Вашу анкету відхилено
                {application?.rejectionReason &&
                  `: ${application.rejectionReason}`}
              </p>
              <button
                onClick={() => navigate("/application")}
                className={css.bannerButton}
              >
                Подати знову
              </button>
            </>
          ) : (
            <>
              <p className={css.bannerText}>
                ⚠️ Ваш акаунт не верифіковано. Заповніть анкету для верифікації
                паспортних даних.
              </p>
              <button
                onClick={() => navigate("/application")}
                className={css.bannerButton}
              >
                Заповнити анкету
              </button>
            </>
          )}
        </div>
      )}

      <div className={css.content}>
        <div className={css.userCard}>
          <h2 className={css.userTitle}>Інформація про користувача</h2>
          <div className={css.userInfo}>
            <div className={css.userField}>
              <span className={css.fieldLabel}>Нікнейм:</span>
              <span className={css.fieldValue}>{user.username}</span>
            </div>
            <div className={css.userField}>
              <span className={css.fieldLabel}>Email:</span>
              <span className={css.fieldValue}>{user.email}</span>
            </div>
            <div className={css.userField}>
              <span className={css.fieldLabel}>Ім'я:</span>
              <span className={css.fieldValue}>{user.name}</span>
            </div>
            <div className={css.userField}>
              <span className={css.fieldLabel}>Прізвище:</span>
              <span className={css.fieldValue}>{user.surname}</span>
            </div>
            {user.passportValid && (
              <div className={css.userField}>
                <span className={css.fieldLabel}>Верифікація:</span>
                <span className={`${css.fieldValue} ${css.verified}`}>
                  ✓ Паспорт верифіковано
                </span>
              </div>
            )}
            {user.balance !== undefined && (
              <div className={css.userField}>
                <span className={css.fieldLabel}>Баланс:</span>
                <span className={css.fieldValue}>{user.balance} грн</span>
              </div>
            )}
            <div className={css.userField}>
              <span className={css.fieldLabel}>Статус:</span>
              <span
                className={`${css.fieldValue} ${
                  user.isOnline ? css.online : css.offline
                }`}
              >
                {user.isOnline ? "В мережі" : "Не в мережі"}
              </span>
            </div>
          </div>
        </div>

        <div className={css.welcomeCard}>
          <h3 className={css.welcomeTitle}>Ласкаво просимо до CraftNova!</h3>
          <p className={css.welcomeText}>
            Ваш акаунт успішно створено. Тут буде розміщено основний контент
            додатку.
          </p>
        </div>
      </div>
    </div>
  );
}
