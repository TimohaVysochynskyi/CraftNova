import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationData } from "../../../types/application.types";
import {
  FormInput,
  FormButton,
  FormError,
} from "../../shared/FormElements/FormElements";
import ApplicationModal from "../ApplicationModal/ApplicationModal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { submitApplication } from "../../../redux/slices/applicationSlice";
import css from "./ApplicationForm.module.css";

export default function ApplicationForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSubmitting } = useAppSelector((state) => state.application);

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhotoConfirmed, setIsPhotoConfirmed] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .min(2, "Ім'я повинно містити мінімум 2 символи")
      .required("Ім'я обов'язкове"),
    lastName: Yup.string()
      .trim()
      .min(2, "Прізвище повинно містити мінімум 2 символи")
      .required("Прізвище обов'язкове"),
    patronymic: Yup.string()
      .trim()
      .min(2, "По-батькові повинно містити мінімум 2 символи")
      .required("По-батькові обов'язкове"),
    birthDate: Yup.string()
      .trim()
      .matches(
        /^\d{2}\.\d{2}\.\d{4}$/,
        "Дата народження повинна бути у форматі ДД.ММ.РРРР"
      )
      .test("is-valid-date", "Введіть коректну дату", (value) => {
        if (!value) return false;
        const [day, month, year] = value.split(".").map(Number);
        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day &&
          date <= new Date()
        );
      })
      .required("Дата народження обов'язкова"),
    passportSeries: Yup.string()
      .length(10, "Серія паспорту повинна містити 10 символів")
      .trim()
      .required("Серія паспорту обов'язкова"),
    passportNumber: Yup.string()
      .trim()
      .length(9, "Номер паспорту має містити рівно 9 цифр")
      .required("Номер паспорту обов'язковий"),
    issuingAuthority: Yup.string()
      .trim()
      .min(4, "Орган, що видав паспорт повинен містити мінімум 4 символи")
      .required("Орган, що видав паспорт обов'язковий"),
    placeOfResidence: Yup.string()
      .trim()
      .min(2, "Місце проживання повинно містити мінімум 2 символи")
      .required("Місце проживання обов'язкове"),
  });

  const initialValues: Omit<
    ApplicationData,
    "passportPhoto" | "userPhoto" | "digitalSignature"
  > = {
    firstName: "",
    lastName: "",
    patronymic: "",
    birthDate: "",
    passportSeries: "",
    passportNumber: "",
    issuingAuthority: "",
    placeOfResidence: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // Конвертуємо дату з DD.MM.YYYY в YYYY-MM-DD для бекенду
      const [day, month, year] = values.birthDate.split(".");
      const formattedBirthDate = `${year}-${month}-${day}`;

      const applicationData = {
        ...values,
        birthDate: formattedBirthDate,
        passportPhoto: passportPhoto || undefined,
        userPhoto: userPhoto || undefined,
        digitalSignature: "true", // Завжди true згідно з вимогами
      };

      const result = await dispatch(submitApplication(applicationData));

      if (submitApplication.fulfilled.match(result)) {
        // Успішно подано - переходимо на DashboardPage
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  const handlePassportPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPassportPhoto(file);
    }
  };

  const handleWebcamPhoto = () => {
    setIsPhotoConfirmed(false); // Скидаємо підтвердження при повторному відкритті
    setIsModalOpen(true);
  };

  const handlePhotoCapture = (photoFile: File, photoDataUrl: string) => {
    setUserPhoto(photoFile);
    console.log("Photo captured:", photoFile.name, photoFile.size);
    console.log("Photo data URL length:", photoDataUrl.length);
    // Не закриваємо модалку автоматично, користувач сам її закриє
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Якщо модалка закривається і фото не зроблене, скидаємо стан
    // Але якщо фото вже зроблене, то зберігаємо його
  };

  const handlePhotoConfirm = () => {
    setIsPhotoConfirmed(true);
  };

  // Обробник для введення дати народження (DD.MM.YYYY)
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Видаляємо все крім цифр

    if (value.length >= 2) {
      value = value.slice(0, 2) + "." + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "." + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    e.target.value = value;
  };

  // Обробник для введення тільки цифр (РНОКПП)
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className={css.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
        >
          {({ errors, touched }) => {
            const fieldOrder = [
              "firstName",
              "lastName",
              "patronymic",
              "birthDate",
              "passportSeries",
              "passportNumber",
              "issuingAuthority",
              "placeOfResidence",
            ];

            const firstError = fieldOrder.find(
              (field) =>
                touched[field as keyof typeof touched] &&
                errors[field as keyof typeof errors]
            );

            return (
              <Form className={css.form}>
                <div className={css.section}>
                  <h3 className={css.sectionTitle}>Введіть ваше ПІБ</h3>
                  <div className={css.row}>
                    <FormInput
                      name="firstName"
                      label=""
                      placeholder="Прізвище"
                    />
                    <FormInput name="lastName" label="" placeholder="Ім'я" />
                    <FormInput
                      name="patronymic"
                      label=""
                      placeholder="По-батькові"
                    />
                  </div>
                </div>

                <div className={css.section}>
                  <h3 className={css.sectionTitle}>
                    Введіть вашу дату народження та паспортні дані
                  </h3>
                  <div className={css.row}>
                    <FormInput
                      name="birthDate"
                      label=""
                      type="text"
                      placeholder="11.11.2008"
                      maxLength={10}
                      onChange={handleDateInput}
                    />
                    <FormInput
                      name="passportSeries"
                      label=""
                      placeholder="РНОКПП"
                      autoComplete="off"
                      maxLength={10}
                      onKeyPress={handleNumericInput}
                    />
                    <FormInput
                      name="passportNumber"
                      label=""
                      placeholder="Номер паспорта"
                      autoComplete="off"
                      maxLength={9}
                      onKeyPress={handleNumericInput}
                    />
                  </div>
                </div>

                <div className={css.section}>
                  <h3 className={css.sectionTitle}>
                    Введіть назву органу, що видав паспорт та ваше місце
                    проживання
                  </h3>
                  <div className={css.rowTwoColumns}>
                    <FormInput
                      name="issuingAuthority"
                      label=""
                      placeholder="Орган, що видав"
                    />
                    <FormInput
                      name="placeOfResidence"
                      label=""
                      placeholder="Місто проживання"
                    />
                  </div>
                </div>

                <div className={css.section}>
                  <h3 className={css.sectionTitle}>
                    Додайте своє фото паспорту та фото вашого обличчя
                  </h3>
                  <div className={css.buttonRow}>
                    <div className={css.fileUpload}>
                      <input
                        type="file"
                        id="passportPhoto"
                        accept="image/*"
                        onChange={handlePassportPhotoUpload}
                        className={css.hiddenInput}
                      />
                      <label
                        htmlFor="passportPhoto"
                        className={`${css.fileButton} ${
                          passportPhoto ? css.fileButtonSuccess : ""
                        }`}
                      >
                        {passportPhoto ? "Фото додано" : "Фото паспорту"}
                        {passportPhoto ? (
                          <svg
                            className={css.fileIcon}
                            viewBox="0 0 26 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M25.6665 2.49776L8.52365 19.5L0.666504 11.7073L2.68079 9.70955L8.52365 15.4903L23.6522 0.5L25.6665 2.49776Z"
                              fill="#CFB293"
                            />
                          </svg>
                        ) : (
                          <svg
                            className={css.fileIcon}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.3334 11.3332H11.3334V19.3332H8.66675V11.3332H0.666748V8.6665H8.66675V0.666504H11.3334V8.6665H19.3334V11.3332Z"
                              fill="#CFB293"
                            />
                          </svg>
                        )}
                      </label>
                    </div>

                    <button
                      type="button"
                      className={`${css.webcamButton} ${
                        userPhoto ? css.webcamButtonSuccess : ""
                      }`}
                      onClick={handleWebcamPhoto}
                      disabled={isSubmitting || isPhotoConfirmed}
                    >
                      {userPhoto ? "Фото зроблено" : "Зробити своє фото"}
                      {userPhoto ? (
                        <svg
                          className={css.fileIcon}
                          viewBox="0 0 26 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M25.6665 2.49776L8.52365 19.5L0.666504 11.7073L2.68079 9.70955L8.52365 15.4903L23.6522 0.5L25.6665 2.49776Z"
                            fill="#CFB293"
                          />
                        </svg>
                      ) : (
                        <svg
                          className={css.fileIcon}
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3334 11.3332H11.3334V19.3332H8.66675V11.3332H0.666748V8.6665H8.66675V0.666504H11.3334V8.6665H19.3334V11.3332Z"
                            fill="#CFB293"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <FormError
                  error={
                    firstError
                      ? errors[firstError as keyof typeof errors]
                      : undefined
                  }
                />

                <div className={css.submitSection}>
                  <FormButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Відправлення..." : "Відправити"}
                  </FormButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPhotoCapture={handlePhotoCapture}
        onPhotoConfirm={handlePhotoConfirm}
      />
    </>
  );
}
