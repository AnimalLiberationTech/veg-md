import { useTheme } from "@/components/theme-provider";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 cursor-pointer justify-center rounded-full bg-gray-2 text-black dark:bg-dark-bg dark:text-white md:h-14 md:w-14"
    >
      <span className="text-[2em] dark:hidden" aria-hidden="true">☀</span>
      <span className="hidden text-[2em] dark:block" aria-hidden="true">☾</span>
    </button>
  );
};

export default ThemeToggler;
