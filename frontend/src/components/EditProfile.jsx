import { useTranslations } from "next-intl";
export default function EditProfile() {
  const t = useTranslations("EditProfile");
  return (
    <div
      id="slide-up-animated-modal"
      className="overlay modal overlay-open:opacity-100 overlay-open:duration-300 hidden"
      role="dialog"
      tabIndex="-1"
    >
      <div className="overlay-animation-target modal-dialog overlay-open:mt-4 overlay-open:opacity-100 overlay-open:duration-300 mt-12 transition-all ease-out">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{t("title")}</h3>
            <button
              type="button"
              className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
              aria-label="Close"
              data-overlay="#slide-up-animated-modal"
            >
              <span className="icon-[tabler--x] size-4"></span>
            </button>
          </div>
          <div className="modal-body">
            <form className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("profilePicture")}</span>
                </label>
                <input type="file" accept="image/*" className="input" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("username")}</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder={t("usernamePlaceholder")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("bio")}</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder={t("bioPlaceholder")}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-soft btn-secondary"
              data-overlay="#slide-up-animated-modal"
            >
              {t("cancel")}
            </button>
            <button type="button" className="btn btn-primary">
              {t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
