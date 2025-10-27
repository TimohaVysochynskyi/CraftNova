import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AvatarWrapper from "../../components/dashboard/AvatarWrapper/AvatarWrapper";
import InfoWrapper from "../../components/dashboard/InfoWrapper/InfoWrapper";
import { useAppDispatch, useAppSelector, useUser } from "../../redux/hooks";
import { logoutUser, updateProfilePhoto } from "../../redux/slices/authSlice";
import { getMyApplication } from "../../redux/slices/applicationSlice";
import css from "./DashboardPage.module.css";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useUser();
  const { application, isLoading } = useAppSelector(
    (state) => state.application
  );
  const { isUpdatingPhoto, profilePhotoVersion } = useAppSelector(
    (state) => state.auth
  );

  const shouldFetchApplication = Boolean(user);

  useEffect(() => {
    if (!shouldFetchApplication) {
      return;
    }
    dispatch(getMyApplication());
  }, [dispatch, shouldFetchApplication]);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate("/auth/login");
  }, [dispatch, navigate]);

  const handleOpenApplication = useCallback(() => {
    navigate("/application");
  }, [navigate]);

  const handleOpenAdmin = useCallback(() => {
    navigate("/admin/applications");
  }, [navigate]);

  const handleAvatarChange = useCallback(
    (file: File) => {
      if (file) {
        dispatch(updateProfilePhoto(file));
      }
    },
    [dispatch]
  );

  const avatarLevelLabel = useMemo(() => {
    if (!user || typeof user.level !== "number") {
      return undefined;
    }
    return `${user.level} lvl`;
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) {
      return "";
    }
    const name = [user.name, user.surname].filter(Boolean).join(" ").trim();
    return name.length > 0 ? name : user.username;
  }, [user]);

  if (!user) {
    return null;
  }

  const isAdmin = Boolean(user.isAdmin);
  const isApproved = application?.status === "approved";
  const isPending = application?.status === "pending";
  const isRejected = application?.status === "rejected";
  const isVerified = Boolean(user.passportValid || isApproved);

  const banner = useMemo(() => {
    if (isLoading) {
      return {
        text: "Перевіряємо статус анкети...",
        buttonLabel: undefined,
      } as const;
    }

    if (isVerified) {
      return null;
    }

    if (isPending) {
      return null;
    }

    if (isRejected) {
      const reason = application?.rejectionReason?.trim();
      const text =
        reason && reason.length > 0
          ? `Анкета відхилена: ${reason}`
          : "Анкета відхилена";
      return {
        text,
        buttonLabel: "Подати знову",
        buttonAction: handleOpenApplication,
      } as const;
    }

    return {
      text: "Верифікація не пройдена",
      buttonLabel: "Заповнити анкету",
      buttonAction: handleOpenApplication,
    } as const;
  }, [
    application?.rejectionReason,
    handleOpenApplication,
    isLoading,
    isPending,
    isRejected,
    isVerified,
  ]);

  return (
    <>
      <img
        src="/images/dashboard-bg.webp"
        alt="Background"
        className={css.background}
      />
      <div className={css.bgBlur}></div>
      <div className={css.container}>
        <div className={css.content}>
          {banner && (
            <div className={css.verifyWrapper}>
              <p className={css.verifyText}>{banner.text}</p>
              {banner.buttonLabel && banner.buttonAction ? (
                <button
                  type="button"
                  className={css.verifyButton}
                  onClick={banner.buttonAction}
                >
                  {banner.buttonLabel}
                </button>
              ) : null}
            </div>
          )}
          <div className={css.main}>
            <div className={`${css.block} ${css.avatarWrapper}`}>
              <AvatarWrapper
                username={displayName}
                avatarUrl={user.photo}
                isOnline={user.isOnline}
                levelLabel={avatarLevelLabel}
                isUploading={isUpdatingPhoto}
                photoVersion={profilePhotoVersion}
                onEditAvatar={handleAvatarChange}
              />
            </div>
            <div className={`${css.block} ${css.infoWrapper}`}>
              <InfoWrapper
                user={user}
                application={application}
                isApplicationLoading={isLoading}
                onLogout={handleLogout}
                onOpenAdmin={isAdmin ? handleOpenAdmin : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
