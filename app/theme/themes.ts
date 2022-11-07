"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    // fontFamily: ["Alegreya Sans SC", "sans-serif"].join(","),
    fontFamily: ["Montserrat Alternates", "sans-serif"].join(","),

    // secondary: {
    //   // fontFamily: ["Josefin Sans", "sans-serif"].join(","),
    //   fontFamily: ["League Script", "cursive"].join(","),
    // },
  },
});
