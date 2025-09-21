import { useNavigate } from "react-router-dom";
import { useAppDispatch, useUser } from "../../redux/hooks";
import { logoutUser } from "../../redux/slices/authSlice";
import css from "./DashboardPage.module.css";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useUser();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>Дашборд</h1>
        <button onClick={handleLogout} className={css.logoutButton}>
          Вийти
        </button>
      </div>

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
