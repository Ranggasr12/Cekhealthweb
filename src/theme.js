"use client";

import { extendBaseTheme } from "@chakra-ui/react";

// Membuat tema dasar yang bisa kamu ubah warnanya nanti
const theme = extendBaseTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
        fontFamily: "Poppins, sans-serif",
      },
    },
  },
});

export default theme;
