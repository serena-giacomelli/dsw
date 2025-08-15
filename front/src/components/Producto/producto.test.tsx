import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Producto from "./Producto"; // Ajustá la ruta si cambia

describe("Producto (componente)", () => {
  const baseProps = {
    id: 1,
    nombre: "Zapatillas Pro",
    descripcion: "Running livianas",
    precio: 12999,
    cantidad: 5,
    imagen: "/img/zapatillas-pro.png",
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("renderiza nombre, descripción y precio", () => {
    render(<Producto {...baseProps} />);
    expect(screen.getByRole("heading", { level: 3, name: /zapatillas pro/i })).toBeInTheDocument();
    expect(screen.getByText(/running livianas/i)).toBeInTheDocument();
    expect(screen.getByText(/^Precio:\s*\$12999$/)).toBeInTheDocument();
  });

  it("muestra los botones Editar y Eliminar", () => {
    render(<Producto {...baseProps} />);
    expect(screen.getByRole("button", { name: /editar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /eliminar/i })).toBeInTheDocument();
  });

  it("ejecuta onEdit y onDelete al hacer click", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<Producto {...baseProps} onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /editar/i }));
    await user.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});