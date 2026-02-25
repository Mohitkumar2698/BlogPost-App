const THEME_KEY = "theme";

export const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (theme) => {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem(THEME_KEY, nextTheme);
  return nextTheme;
};

export const initTheme = () => {
  const theme = getPreferredTheme();
  return applyTheme(theme);
};
