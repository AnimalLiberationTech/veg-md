import { useTheme } from "@/components/theme-provider";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 cursor-pointer justify-center rounded-full bg-gray-2 text-black -translate-y-1 translate-x-0.5 dark:bg-dark-bg dark:text-white md:h-16 md:w-12 md:translate-x-0 md:translate-y-1"
    >
      <span className="text-[2em] dark:hidden md:text-[2.2em]" aria-hidden="true">☾</span>
      <span className="hidden text-[2em] dark:block md:text-[2.2em]" aria-hidden="true">☀</span>
    </button>
  );
};

export default ThemeToggler;
