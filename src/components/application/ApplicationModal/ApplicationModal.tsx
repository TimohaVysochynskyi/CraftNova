import css from "./ApplicationModal.module.css";
import { useEffect, useRef, useState } from "react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture?: (photoFile: File, photoDataUrl: string) => void;
  onPhotoConfirm?: () => void;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onPhotoCapture,
}: // onPhotoConfirm,
ApplicationModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    // Коли отримали stream, відразу підключаємо його до відео
    if (stream && videoRef.current && !capturedPhoto) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, capturedPhoto]);

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setHasPermission(false);
    setCapturedPhoto(null);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    // Відео автоматично відновиться через useEffect
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Встановлюємо розміри canvas як квадрат (як characterBlock)
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    // Зберігаємо поточний стан контексту
    context.save();

    // Відображаємо дзеркально (як у відео)
    context.scale(-1, 1);
    context.translate(-size, 0);

    // Розраховуємо позицію для центрування відео в квадраті
    const sourceX = (video.videoWidth - size) / 2;
    const sourceY = (video.videoHeight - size) / 2;

    // Малюємо обрізане та відцентроване зображення
    context.drawImage(
      video,
      sourceX,
      sourceY,
      size,
      size, // source rectangle
      0,
      0,
      size,
      size // destination rectangle
    );

    // Відновлюємо стан контексту
    context.restore();

    // Отримуємо зображення як Data URL
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedPhoto(photoDataUrl);

    // Зупиняємо відео (воно буде замінене на зображення)
    if (video.srcObject) {
      video.pause();
    }

    // Конвертуємо у File для відправки на сервер
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          // Викликаємо callback з фото файлом та data URL
          if (onPhotoCapture) {
            onPhotoCapture(file, photoDataUrl);
          }
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modalContainer}>
        <div className={css.modal}>
          <div className={css.modalSquare}></div>
          <div className={css.modalSquare}></div>
          <div className={css.modalSquare}></div>
          <div className={css.modalSquare}></div>
          <div className={css.content}>
            <button className={css.closeButton} onClick={onClose}>
              <svg
                className={css.closeIcon}
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.54545 6.54545H0V65.4545H6.54545V6.54545ZM6.54545 6.54545H65.4545V0H6.54545V6.54545ZM6.54545 72H65.4545V65.4545H6.54545V72ZM19.6364 52.3636H26.1818V45.8182H19.6364V52.3636ZM26.1818 45.8182H32.7273V39.2727H26.1818V45.8182ZM32.7273 39.2727H39.2727V32.7273H32.7273V39.2727ZM19.6364 26.1818H26.1818V19.6364H19.6364V26.1818ZM26.1818 32.7273H32.7273V26.1818H26.1818V32.7273ZM39.2727 45.8182H45.8182V39.2727H39.2727V45.8182ZM45.8182 52.3636H52.3636V45.8182H45.8182V52.3636ZM39.2727 32.7273H45.8182V26.1818H39.2727V32.7273ZM45.8182 26.1818H52.3636V19.6364H45.8182V26.1818ZM65.4545 65.4545H72V6.54545H65.4545V65.4545Z"
                  fill="#272016"
                />
              </svg>
            </button>
            <div className={css.topSection}>
              <div className={css.characterBlock}>
                {isLoading ? (
                  <div className={css.loadingText}>
                    Запит дозволу на камеру...
                  </div>
                ) : hasPermission ? (
                  capturedPhoto ? (
                    <img
                      src={capturedPhoto}
                      alt="Captured photo"
                      className={css.characterImage}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={css.videoStream}
                    />
                  )
                ) : (
                  <div className={css.errorText}>
                    Немає доступу до камери. Необхідний доступ у налаштуваннях
                    браузера.
                  </div>
                )}
              </div>

              <div className={css.buttonsContainer}>
                <div className={css.actionButtonWrapper}>
                  <button className={css.actionButton} onClick={handleRetake}>
                    <svg
                      className={css.actionIcon}
                      viewBox="0 0 68 68"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M51 0H42.5V8.5H51V17H8.5V25.5H0V59.5H8.5V68H34V59.5H8.5V25.5H51V34H42.5V42.5H51V34H59.5V25.5H68V17H59.5V8.5H51V0Z"
                        fill="#CFB293"
                      />
                    </svg>
                  </button>
                </div>
                <div className={css.actionButtonWrapper}>
                  <button
                    className={css.actionButton}
                    onClick={handleTakePhoto}
                  >
                    <svg
                      className={css.actionIcon}
                      viewBox="0 0 76 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_d_100_242)">
                        <path
                          d="M65.9091 3.18173V0.0908203H4.09091V3.18173H1V58.8181H4.09091V61.909H65.9091V58.8181H69V3.18173H65.9091ZM7.18182 6.27264H25.7273V9.36355H7.18182V6.27264ZM28.8182 55.7272H7.18182V24.8181H28.8182V27.909H22.6364V34.0908H19.5455V46.4545H22.6364V52.6363H28.8182V55.7272ZM25.7273 46.4545V34.0908H28.8182V30.9999H41.1818V34.0908H44.2727V46.4545H41.1818V49.5454H28.8182V46.4545H25.7273ZM62.8182 55.7272H41.1818V52.6363H47.3636V46.4545H50.4545V34.0908H47.3636V27.909H41.1818V24.8181H62.8182V55.7272ZM62.8182 18.6363H7.18182V15.5454H25.7273V12.4545H28.8182V9.36355H31.9091V6.27264H62.8182V18.6363Z"
                          fill="#CFB293"
                        />
                      </g>
                      <path
                        d="M38.0905 34.0913V37.1822H31.9087V43.364H28.8177V34.0913H38.0905Z"
                        fill="#CFB293"
                      />
                      <defs>
                        <filter
                          id="filter0_d_100_242"
                          x="0"
                          y="0.0908203"
                          width="76"
                          height="69.8184"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dx="3" dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_100_242"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_100_242"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={css.bottomSection}>
              <div className={css.instructionText}>
                {!hasPermission
                  ? "Потрібен дозвіл камери для продовження"
                  : capturedPhoto
                  ? "Фото зроблено! Натисни кнопку перезняти для нового фото або закрий вікно"
                  : "Розмісти обличчя в рамці, дивися прямо в камеру. Натисни кнопку, коли будеш готовий"}
              </div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
