import React from "react";
import { render, screen } from "@testing-library/react";
import { Transport } from "./transportista";

describe("Transport (componente)", () => {
  const baseProps = {
    nombre: "Transporte Rápido",
    contacto: "Juan Pérez",
    id: 7,
  };

  it("renderiza nombre, contacto e id", () => {
    render(<Transport {...baseProps} />);
    expect(screen.getByRole("heading", { level: 1, name: /transporte rápido/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /juan pérez/i })).toBeInTheDocument();
    expect(screen.getByText(/id: 7/i)).toBeInTheDocument();
  });

  it("muestra el botón Confirmar", () => {
    render(<Transport {...baseProps} />);
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
  });
});