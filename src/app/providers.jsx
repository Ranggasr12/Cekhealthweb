"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      html: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
      },
      body: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        backgroundColor: "white",
        fontFamily: "inherit",
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
  fonts: {
    heading: "var(--font-poppins)",
    body: "var(--font-poppins)",
  },
  breakpoints: {
    base: "0em", // 0px
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
});

export default function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}