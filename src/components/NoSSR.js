"use client";

import { useEffect, useState } from 'react';

export default function NoSSR({ children, fallback = null }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? children : fallback;
}