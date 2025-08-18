import React from "react";
import { render, screen } from "@testing-library/react";
import { Usuario } from "./usuario";

describe("Usuario (componente)", () => {
  const baseProps = {
    nombre: "Ana",
    apellido: "García",
    dni: "12345678",
    fechaNacimiento: "1990-05-10",
  };

  it("renderiza nombre, apellido, dni y fecha de nacimiento", () => {
    render(<Usuario {...baseProps} />);
    expect(screen.getByRole("heading", { level: 1, name: /ana/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /garcía/i })).toBeInTheDocument();
    expect(screen.getByText(/dni: 12345678/i)).toBeInTheDocument();
    expect(screen.getByText(/fecha de nacimiento: 1990-05-10/i)).toBeInTheDocument();
  });

  it("no muestra fecha de nacimiento si no se pasa el prop", () => {
    const { fechaNacimiento, ...propsSinFecha } = baseProps;
    render(<Usuario {...propsSinFecha} />);
    expect(screen.queryByText(/fecha de nacimiento/i)).not.toBeInTheDocument();
  });

  it("muestra el botón Confirmar", () => {
    render(<Usuario {...baseProps} />);
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
  });
});
