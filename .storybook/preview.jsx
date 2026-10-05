import "../src/styles/index.css";
import { ThemeContext, darkTokens, lightTokens } from "../src/app/context/ThemeContext";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: "App theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "dark" },

  decorators: [
    // Provide the theme and draw the same 360x480 popup frame the real app uses.
    // Stories never touch localStorage: every component gets fake data via props.
    (Story, context) => {
      const mode = context.globals.theme === "light" ? "light" : "dark";
      const tokens = mode === "light" ? lightTokens : darkTokens;
      return (
        <ThemeContext.Provider value={{ mode, tokens, setMode: () => {} }}>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              background: tokens.pageBackground,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              className="relative flex flex-col overflow-hidden"
              style={{
                width: 360,
                height: 480,
                background: tokens.popupBg,
                borderRadius: 16,
                boxShadow: tokens.popupShadow,
                border: `1px solid ${tokens.popupBorder}`,
              }}
            >
              <Story />
            </div>
          </div>
        </ThemeContext.Provider>
      );
    },
  ],

  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
