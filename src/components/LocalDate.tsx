// src/components/LocalDate.tsx

"use client";

import { useEffect, useState } from "react";

interface LocalDateProps {
  date: string | Date;
  options?: Intl.DateTimeFormatOptions; // Optional formatting
}

export default function LocalDate({ date, options }: LocalDateProps) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    setFormatted(d.toLocaleDateString(undefined, options));
  }, [date, options]);

  return <>{formatted}</>;
}
