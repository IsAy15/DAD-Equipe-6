import { useTranslations } from "next-intl";
import { updateUserProfile } from "../utils/api";
import { useAuth } from "@/contexts/authcontext";
import { useState } from "react";

export default function EditProfile() {
  const { user, token } = useAuth();
  const t = useTranslations("EditProfile");
  const [uploading, setUploading] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const handleAvatar = async (e) => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("file", image);

    setUploading(true);

    const res = await fetch("/api/upload_pp", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    setAvatar(data.url);
    setUploading(false);
  };
  const handleSubmit = async (e) => {
    console.log("Submitting form");
    e.preventDefault();
    if (!bio && !avatar) {
      console.log("No changes to save");
      return;
    }

    try {
      await updateUserProfile(bio, avatar, token);
      // refresh page
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (e.g., show an error message)
    }
  };
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("profilePicture")}</span>
                </label>
                <div className="p-4">
                  {avatar && (
                    <div className="mt-4">
                      <img src={avatar} alt="uploaded" className="w-48" />
                    </div>
                  )}
                  {uploading && (
                    <div className="loading loading-spinner loading-lg"></div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="input"
                    onChange={handleAvatar}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("username")}</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  name="username"
                  disabled={true}
                  defaultValue={user.username}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("bio")}</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder={t("bioPlaceholder")}
                  name="bio"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
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
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
