"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserLocale, setUserLocale } from "../services/locale";

export default function NavBar() {
  const t = useTranslations("Navbar");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    async function fetchLanguage() {
      const storedLanguage = await getUserLocale();
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }
    fetchLanguage();
  }, []);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setUserLocale(selectedLanguage);
  };

  return (
    <nav className="navbar shadow">
      <div className="navbar-start">
        <Link
          className="link text-base-content/90 link-neutral text-xl font-semibold no-underline"
          href="/"
        >
          {t("title")}
        </Link>
      </div>

      <div className="navbar-center max-sm:hidden">
        <ul className="menu menu-horizontal gap-2 p-0 text-base rtl:ml-20">
          <li className="dropdown relative inline-flex [--offset:9] [--placement:bottom-end] max-sm:[--placement:bottom]">
            <button
              id="dropdown-css-components"
              type="button"
              className="dropdown-toggle dropdown-open:bg-base-content/10 dropdown-open:text-base-content max-sm:px-2"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              CSS Components
              <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
            </button>
            <ul
              className="dropdown-menu  dropdown-open:opacity-100 hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="ui-components"
            >
              <li>
                <Link className="dropdown-item" href="../button">
                  Button
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="../card">
                  Card
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="../form-elements">
                  Form Elements
                </Link>
              </li>
            </ul>
          </li>
          <li className="dropdown relative [--offset:9] [--placement:bottom-end] max-sm:[--placement:bottom]">
            <button
              id="dropdown-js-components"
              className="dropdown-toggle dropdown-item dropdown-open:bg-base-content/10 dropdown-open:text-base-content justify-between"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              JS Components
              <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4 rtl:rotate-180"></span>
            </button>
            <ul
              className="dropdown-menu dropdown-open:opacity-100 hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="js-components"
            >
              <li>
                <Link className="dropdown-item" href="../accordion">
                  Accordion
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="../overlays">
                  Overlays
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="../advance-forms">
                  Advance Forms
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="navbar-end items-center gap-4">
        <div className="dropdown relative inline-flex sm:hidden rtl:[--placement:bottom-end]">
          <button
            id="dropdown-default"
            type="button"
            className="dropdown-toggle btn btn-outline btn-secondary btn-square"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <span className="icon-[tabler--menu-2] dropdown-open:hidden size-5"></span>
            <span className="icon-[tabler--x] dropdown-open:block hidden size-5"></span>
          </button>
          <ul
            className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-default"
          >
            <li className="dropdown relative [--offset:9] [--placement:bottom-end] max-sm:[--placement:bottom]">
              <button
                id="dropdown-css-components-2"
                className="dropdown-toggle dropdown-item dropdown-open:bg-base-content/10 dropdown-open:text-base-content justify-between"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                CSS Components
                <span className="icon-[tabler--chevron-right] size-4 rtl:rotate-180"></span>
              </button>
              <ul
                className="dropdown-menu  dropdown-open:opacity-100 hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="ui-components"
              >
                <li>
                  <Link className="dropdown-item" href="../button">
                    Button
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="../card">
                    Card
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="../form-elements">
                    Form Elements
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown relative [--offset:9] [--placement:bottom-end] max-sm:[--placement:bottom]">
              <button
                id="dropdown-js-components-2"
                className="dropdown-toggle dropdown-item dropdown-open:bg-base-content/10 dropdown-open:text-base-content justify-between"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                JS Components
                <span className="icon-[tabler--chevron-right] size-4 rtl:rotate-180"></span>
              </button>
              <ul
                className="dropdown-menu dropdown-open:opacity-100 hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="js-components"
              >
                <li>
                  <Link className="dropdown-item" href="../accordion">
                    Accordion
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="../overlays">
                    Overlays
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="../advance-forms">
                    Advance Forms
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="dropdown relative inline-flex rtl:[--placement:bottom-end]">
          <button
            id="dropdown-default"
            type="button"
            className="dropdown-toggle btn btn-primary btn-outline max-sm:btn-square"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <span className="max-sm:hidden">{t("theme")}</span>
            <span className="icon-[tabler--aperture] block size-6 sm:hidden"></span>
            <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-5 max-sm:hidden"></span>
          </button>
          <ul
            className="dropdown-menu dropdown-open:opacity-100 hidden min-w-40"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-default"
          >
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Default"
                value="light"
                checked={theme === "light"}
                onChange={handleThemeChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Dark"
                value="dark"
                checked={theme === "dark"}
                onChange={handleThemeChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Gourmet"
                value="gourmet"
                checked={theme === "gourmet"}
                onChange={handleThemeChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Corporate"
                value="corporate"
                checked={theme === "corporate"}
                onChange={handleThemeChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Luxury"
                value="luxury"
                checked={theme === "luxury"}
                onChange={handleThemeChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-text w-full justify-start"
                aria-label="Soft"
                value="soft"
                checked={theme === "soft"}
                onChange={handleThemeChange}
              />
            </li>
          </ul>
        </div>
        <div className="dropdown relative inline-flex rtl:[--placement:bottom-end]">
          <button
            id="dropdown-default"
            type="button"
            className="dropdown-toggle btn btn-outline max-sm:btn-square"
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label="Dropdown"
          >
            <span className="max-sm:hidden">{t("language")}</span>
            <span className="icon-[tabler--aperture] block size-6 sm:hidden"></span>
            <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-5 max-sm:hidden"></span>
          </button>
          <ul
            className="dropdown-menu dropdown-open:opacity-100 hidden min-w-40"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-default"
          >
            <li>
              <input
                type="radio"
                name="language-dropdown"
                className="language-controller btn btn-text w-full justify-start"
                aria-label="English"
                value="en"
                checked={language === "en"}
                onChange={handleLanguageChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="language-dropdown"
                className="language-controller btn btn-text w-full justify-start"
                aria-label="Français"
                value="fr"
                checked={language === "fr"}
                onChange={handleLanguageChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="language-dropdown"
                className="language-controller btn btn-text w-full justify-start"
                aria-label="Deutsch"
                value="de"
                checked={language === "de"}
                onChange={handleLanguageChange}
              />
            </li>
            <li>
              <input
                type="radio"
                name="language-dropdown"
                className="language-controller btn btn-text w-full justify-start"
                aria-label="العربية"
                value="ar"
                checked={language === "ar"}
                onChange={handleLanguageChange}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
