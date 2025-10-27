import { useRef } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import css from "./AvatarWrapper.module.css";

interface AvatarWrapperProps {
  username: string;
  avatarUrl?: string | null;
  isOnline?: boolean | number;
  levelLabel?: string;
  isUploading?: boolean;
  photoVersion?: number;
  onEditAvatar?: (file: File) => void;
}

const ONLINE_COLOR = "rgba(55, 141, 89, 1)";
const OFFLINE_COLOR = "rgba(148, 163, 184, 1)";
const DEFAULT_AVATAR = "/images/dashboard-avatar.png";

export default function AvatarWrapper({
  username,
  avatarUrl,
  isOnline,
  levelLabel,
  isUploading,
  photoVersion = 0,
  onEditAvatar,
}: AvatarWrapperProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resolvedAvatar =
    avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl : DEFAULT_AVATAR;
  const statusColor = Boolean(isOnline) ? ONLINE_COLOR : OFFLINE_COLOR;
  const avatarSrc = (() => {
    if (
      !resolvedAvatar ||
      resolvedAvatar.startsWith("data:") ||
      resolvedAvatar === DEFAULT_AVATAR
    ) {
      return resolvedAvatar;
    }
    if (!photoVersion) {
      return resolvedAvatar;
    }
    return resolvedAvatar.includes("?")
      ? `${resolvedAvatar}&v=${photoVersion}`
      : `${resolvedAvatar}?v=${photoVersion}`;
  })();

  type UsernameStyles = CSSProperties & { "--status-color": string };
  const usernameStyles: UsernameStyles = {
    "--status-color": statusColor,
  };

  const handleEditClick = () => {
    if (!onEditAvatar || isUploading) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onEditAvatar) {
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      onEditAvatar(file);
    }
    event.target.value = "";
  };

  return (
    <div className={css.container}>
      <div className={css.top}>
        <h2 className={css.username} style={usernameStyles}>
          {username || "—"}
        </h2>
        <p className={css.level}>{levelLabel ?? "— lvl"}</p>
      </div>
      <div className={css.avatarWrapper}>
        <img
          src={avatarSrc}
          alt={username ? `${username} avatar` : "User avatar"}
          className={isUploading ? `${css.avatar} ${css.loading}` : css.avatar}
        />
        {isUploading ? (
          <div className={css.loaderOverlay}>
            <div className={css.spinner} />
          </div>
        ) : null}
      </div>
      <button
        type="button"
        className={css.editButton}
        onClick={handleEditClick}
        aria-label="Редагувати аватар"
        disabled={!onEditAvatar || Boolean(isUploading)}
      >
        <svg
          className={css.editIcon}
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.0169 20.6649C16.6411 21.0371 16.3431 21.4791 16.1398 21.9655C15.9366 22.4519 15.8322 22.9732 15.8325 23.4996V29.1383H21.561C22.6343 29.1383 23.6654 28.7157 24.4253 27.963L41.3131 11.2274C41.6897 10.8554 41.9885 10.4133 42.1923 9.92672C42.3962 9.44011 42.5011 8.91843 42.5011 8.39159C42.5011 7.86474 42.3962 7.34307 42.1923 6.85645C41.9885 6.36983 41.6897 5.92782 41.3131 5.55574L39.6444 3.90287C39.2686 3.52955 38.8222 3.23335 38.3307 3.03124C37.8392 2.82913 37.3123 2.7251 36.7801 2.7251C36.2479 2.7251 35.721 2.82913 35.2294 3.03124C34.7379 3.23335 34.2915 3.52955 33.9158 3.90287L17.0169 20.6649Z"
            stroke="#272016"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42.4975 22.5351C42.4975 31.8734 42.4975 36.5415 39.5688 39.4423C36.6401 42.3431 31.9248 42.3431 22.4987 42.3431C13.0727 42.3431 8.35741 42.3431 5.4287 39.4423C2.5 36.5415 2.5 31.8712 2.5 22.5351C2.5 13.1989 2.5 8.5286 5.4287 5.62782C8.35741 2.72705 13.0727 2.72705 22.4987 2.72705"
            stroke="#272016"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={css.fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
