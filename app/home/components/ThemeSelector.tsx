import clsx from "clsx";

const themes = ["Modern", "Vintage", "Minimalist", "Professional"] as const;
type Theme = (typeof themes)[number];

const themeImages: Record<Theme, string> = {
  Modern:
    "https://img.freepik.com/premium-photo/modern-interior-living-room-soft-sofa-wall-dark-3d-rendering_43151-725.jpg",
  Vintage:
    "https://img.freepik.com/free-photo/green-vintage-sofa_1203-3142.jpg",
  Minimalist:
    "https://img.freepik.com/free-photo/interior-design-with-photoframes-couch_23-2149385443.jpg",
  Professional:
    "https://img.freepik.com/premium-photo/interior-furniture-salon-shopping-room-with-sofas_255667-70656.jpg",
};

type ThemeSelectorProps = {
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
};

/**
 * Theme selector component for interior design styles
 */
export default function ThemeSelector({
  selectedTheme,
  onThemeSelect,
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-400">
      <span>Select Interior Design Type</span>
      <div className="mt-3 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {themes.map((theme) => (
          <div
            key={theme}
            onClick={() => onThemeSelect(theme)}
            className="flex cursor-pointer flex-col items-center"
          >
            <img
              loading="lazy"
              width={100}
              height={100}
              decoding="async"
              src={themeImages[theme]}
              alt={theme}
              className={clsx(
                "h-[70px] rounded-md p-1 transition-all hover:scale-105",
                selectedTheme === theme
                  ? "border-2 border-indigo-600"
                  : "border border-transparent"
              )}
              style={{ color: "transparent" }}
            />
            <h2 className="mt-1 text-center text-sm">{theme}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export { themes, type Theme, themeImages };
