import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchApplicationById,
  updateStatus,
  deleteApplicationById,
  clearCurrentApplication,
} from "../../redux/slices/adminSlice";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentApplication, loading } = useAppSelector(
    (state) => state.admin
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
    return () => {
      dispatch(clearCurrentApplication());
    };
  }, [dispatch, id]);

  const handleStatusChange = (newStatus: "approved" | "rejected") => {
    if (newStatus === "rejected") {
      setShowRejectModal(true);
    } else {
      dispatch(
        updateStatus({
          applicationId: id!,
          status: newStatus,
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          // Перезавантажуємо дані після успішної зміни статусу
          dispatch(fetchApplicationById(id!));
        }
      });
    }
  };

  const handleRejectConfirm = () => {
    if (rejectionReason.trim() && rejectionReason.trim().length >= 10) {
      dispatch(
        updateStatus({
          applicationId: id!,
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setShowRejectModal(false);
          setRejectionReason("");
          // Перезавантажуємо дані після успішної зміни статусу
          dispatch(fetchApplicationById(id!));
        }
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Ви впевнені, що хочете видалити цю заявку?")) {
      dispatch(deleteApplicationById(id!)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success("Заявку видалено");
          navigate("/admin/applications");
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Завантаження...</div>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Заявку не знайдено</p>
        <button
          onClick={() => navigate("/admin/applications")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Повернутися до списку
        </button>
      </div>
    );
  }

  const app = currentApplication;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "На розгляді",
      approved: "Схвалено",
      rejected: "Відхилено",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/applications")}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Назад до списку
        </button>
        <div className="flex items-center gap-4">
          {getStatusBadge(app.status)}
          {app.status === "pending" ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange("approved")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Схвалити
              </button>
              <button
                onClick={() => handleStatusChange("rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Відхилити
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Видалити заявку
            </button>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Заявка #{app.id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Інформація про користувача
            </h3>
            <div className="space-y-3">
              {app.username && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Нікнейм:
                  </label>
                  <p className="text-base text-gray-900">{app.username}</p>
                </div>
              )}
              {app.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email:
                  </label>
                  <p className="text-base text-gray-900">{app.email}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  ID користувача:
                </label>
                <p className="text-base text-gray-900">{app.userId}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Персональні дані
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Прізвище:
                </label>
                <p className="text-base text-gray-900">{app.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Ім'я:
                </label>
                <p className="text-base text-gray-900">{app.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  По батькові:
                </label>
                <p className="text-base text-gray-900">{app.patronymic}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Дата народження:
                </label>
                <p className="text-base text-gray-900">
                  {new Date(app.birthDate).toLocaleDateString("uk-UA")}
                </p>
              </div>
            </div>
          </div>

          {/* Passport Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Паспортні дані
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Серія паспорта:
                </label>
                <p className="text-base text-gray-900">{app.passportSeries}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Номер паспорта:
                </label>
                <p className="text-base text-gray-900">{app.passportNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Орган, що видав:
                </label>
                <p className="text-base text-gray-900">
                  {app.issuingAuthority}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Місце проживання:
                </label>
                <p className="text-base text-gray-900">
                  {app.placeOfResidence}
                </p>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Інформація про обробку
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Дата подачі:
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(app.createdAt)}
                </p>
              </div>
              {app.processedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Дата обробки:
                  </label>
                  <p className="text-base text-gray-900">
                    {formatDate(app.processedAt)}
                  </p>
                </div>
              )}
              {app.processorUsername && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Оброблено:
                  </label>
                  <p className="text-base text-gray-900">
                    {app.processorUsername}
                  </p>
                </div>
              )}
              {app.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Причина відхилення:
                  </label>
                  <p className="text-base text-red-600">
                    {app.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Фотографії</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Фото користувача:
            </label>
            <img
              src={app.userPhotoUrl}
              alt="Фото користувача"
              className="w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Фото паспорта:
            </label>
            <img
              src={app.passportPhotoUrl}
              alt="Фото паспорта"
              className="w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Причина відхилення
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Введіть причину відхилення заявки (мінімум 10 символів)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            {rejectionReason.trim() && rejectionReason.trim().length < 10 && (
              <p className="text-sm text-red-600 mt-1">
                Причина має містити щонайменше 10 символів
              </p>
            )}
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={
                  !rejectionReason.trim() || rejectionReason.trim().length < 10
                }
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Відхилити заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
