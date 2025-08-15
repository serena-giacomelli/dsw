import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",           // Necesario para componentes React
    setupFiles: ["./setupTests.ts"], // Archivo de configuración
    globals: true,                   // Para no importar expect/vi en cada test
    css: true
  },
});