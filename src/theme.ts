import { createTheme, ThemeOptions } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      fire: {
        main: "#FBB741",
      },
      primary: {
        main: "#8b4fc8",
      },
      ...(mode === "dark" && {
        background: {
          default: "#121212",
          paper: "#1e1e1e",
          dayBox: "rgba(168, 168, 168, 0.38)",
        },
      }),
      ...(mode === "light" && {
        background: {
          dayBox: "rgba(168, 168, 168, 0.38)",
        },
      }),
    },
    components: {
      // Override styles for all instances of MuiButtonBase and derived components
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "114px",
            padding: "12px",
            fontSize:'0.91rem'
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          // Override the default focus visible behavior
          root: {
            // This targets the focus-visible state (when the component is focused using the keyboard)
            "&.Mui-focusVisible": {
              outline: "none", // Removes the outline
            },
            "&:focus": {
              outline: "none", // Additional override, in case Mui-focusVisible doesn't catch all focus states
            },
          },
        },
      },
    },
  } as ThemeOptions);
