import css from "./ApplicationPage.module.css";
import ApplicationWrapper from "../../components/application/ApplicationWrapper/ApplicationWrapper";

export default function ApplicationPage() {
  return (
    <div className={css.container}>
      <div className={css.bgDark}></div>
      <div className={css.contentWrapper}>
        <ApplicationWrapper />
      </div>
    </div>
  );
}
