"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LoginForm() {
  const t = useTranslations("Auth");
  return (
    <div className="bg-base-100 flex h-auto min-h-screen items-center justify-center overflow-x-hidden py-10">
      <div className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 shadow-base-300/20 z-1 w-full space-y-6 rounded-xl p-6 shadow-md sm:min-w-md lg:p-8">
          <div className="flex items-center gap-3">
            {/* <img
              src="https://cdn.flyonui.com/fy-assets//logo/logo.png"
              className="size-8"
              alt="brand-logo"
            /> */}
            <h2 className="text-base-content text-xl font-bold">Breezy</h2>
          </div>
          <div>
            <h3 className="text-base-content mb-1.5 text-2xl font-semibold">
              {t("loginTitle")}
            </h3>
            <p className="text-base-content/80">{t("loginDescription")}</p>
          </div>
          <div className="space-y-4">
            <form
              className="mb-4 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="label-text" htmlFor="userEmail">
                  {t("email")}
                </label>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="input"
                  id="userEmail"
                  required
                />
              </div>
              <div>
                <label className="label-text" htmlFor="userPassword">
                  {t("password")}
                </label>
                <div className="input">
                  <input
                    id="userPassword"
                    type="password"
                    placeholder="············"
                    required
                  />
                  <button
                    type="button"
                    data-toggle-password='{ "target": "#userPassword" }'
                    className="block cursor-pointer"
                    aria-label="userPassword"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-y-2 flex-col md:flex-row">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    id="rememberMe"
                  />
                  <label
                    className="label-text text-base-content/80 p-0 text-base"
                    htmlFor="rememberMe"
                  >
                    {t("rememberMe")}
                  </label>
                </div>
                <Link
                  href="#"
                  className="link link-animated link-primary font-normal"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <button className="btn btn-lg btn-primary btn-gradient btn-block">
                {t("loginButton")}
              </button>
            </form>
            <div className="divider">{t("noAccount")}</div>
            <div className="flex items-center justify-between gap-y-2 flex-col md:flex-row mb-4 text-base-content/80 text-center md:text-left">
              {/* <span>{t("noAccount")}</span> */}
              <Link
                href="/register"
                // className="link link-animated link-primary font-normal"
                className="btn btn-lg btn-primary btn-gradient btn-block"
              >
                {t("createAccount")}
              </Link>
            </div>
            <div className="divider">{t("or")}</div>
            <button className="btn btn-text btn-block">
              <img
                src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/brand-logo/google-icon.png"
                alt="google icon"
                className="size-5 object-cover"
              />
              <span className="ml-2">{t("loginWithGoogle")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
