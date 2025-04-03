"use client";
import { scan } from "react-scan";
import { JSX, useEffect } from "react";

export default function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
}
