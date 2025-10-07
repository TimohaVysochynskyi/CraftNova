import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchApplications,
  setPage,
  setFilters,
  updateStatus,
  deleteApplicationById,
} from "../../redux/slices/adminSlice";
import type { AdminApplication } from "../../types/admin.types";

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    applications = [],
    total = 0,
    page = 1,
    totalPages = 0,
    filters,
    loading,
  } = useAppSelector((state) => state.admin);

  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch, page, filters]);

  const handleRowClick = (applicationId: number) => {
    navigate(`/admin/applications/${applicationId}`);
  };

  const handleStatusChange = (
    app: AdminApplication,
    newStatus: "approved" | "rejected"
  ) => {
    if (newStatus === "rejected") {
      setSelectedApp(app);
      setShowRejectModal(true);
    } else {
      dispatch(
        updateStatus({
          applicationId: app.id.toString(),
          status: newStatus,
        })
      );
    }
  };

  const handleRejectConfirm = () => {
    if (
      selectedApp &&
      rejectionReason.trim() &&
      rejectionReason.trim().length >= 10
    ) {
      dispatch(
        updateStatus({
          applicationId: selectedApp.id.toString(),
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
        })
      );
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectionReason("");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю заявку?")) {
      dispatch(deleteApplicationById(id));
    }
  };

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleStatusFilter = (
    status: "all" | "pending" | "approved" | "rejected"
  ) => {
    dispatch(setFilters({ status }));
  };

  const handleSort = (sortBy: "submittedAt" | "processedAt" | "username") => {
    const newOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    dispatch(setFilters({ sortBy, sortOrder: newOrder }));
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
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading && (!applications || applications.length === 0)) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Пошук за користувачем..."
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filters.status || "all"}
            onChange={(e) => handleStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Всі статуси</option>
            <option value="pending">На розгляді</option>
            <option value="approved">Схвалено</option>
            <option value="rejected">Відхилено</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("username")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Користувач{" "}
                  {filters.sortBy === "username" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата народження
                </th>
                <th
                  onClick={() => handleSort("submittedAt")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Подано{" "}
                  {filters.sortBy === "submittedAt" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications?.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => handleRowClick(app.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {app.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(app.birthDate).toLocaleDateString("uk-UA")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(app.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {app.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(app, "approved");
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Схвалити
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(app, "rejected");
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Відхилити
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(app.id.toString());
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Видалити
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!applications || applications.length === 0) && !loading && (
          <div className="text-center py-8 text-gray-500">
            Заявок не знайдено
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => dispatch(setPage(page - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Попередня
            </button>
            <button
              onClick={() => dispatch(setPage(page + 1))}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Наступна
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано{" "}
                <span className="font-medium">{applications.length}</span> з{" "}
                <span className="font-medium">{total}</span> результатів
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => dispatch(setPage(pageNum))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

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
                  setSelectedApp(null);
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
