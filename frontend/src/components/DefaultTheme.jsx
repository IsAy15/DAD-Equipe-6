"use client";

import { useEffect } from "react";
import { getUserTheme, setUserTheme } from "../services/theme";

export default function DefaultTheme() {
  useEffect(() => {
    async function fetchTheme() {
      const storedTheme = await getUserTheme();
      if (!storedTheme) {
        const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
        const defaultTheme = matchDark.matches ? "dark" : "light";
        setUserTheme(defaultTheme);
      }
    }

    // // Ajout du listener pour le changement de thème système
    // const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    // const handleChange = (e) => {
    //   setUserTheme(e.matches ? "dark" : "light");
    // };
    // matchDark.addEventListener("change", handleChange);

    // fetchTheme();

    // return () => {
    //   matchDark.removeEventListener("change", handleChange);
    // };
  }, []);
  return null;
}
