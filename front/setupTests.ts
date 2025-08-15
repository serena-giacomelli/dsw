import "@testing-library/jest-dom/vitest"; // Extiende expect automáticamente

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});