import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="btn btn-ghost rounded-full px-3 py-1.5"
      title={dark ? "Switch to light" : "Switch to dark"}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? (
        // sun icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.8"
            d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M8 12a4 4 0 108 0 4 4 0 00-8 0z"
          />
        </svg>
      ) : (
        // moon icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.64 13.01A9 9 0 1111 2.36a7 7 0 1010.64 10.65z" />
        </svg>
      )}
    </button>
  );
}
