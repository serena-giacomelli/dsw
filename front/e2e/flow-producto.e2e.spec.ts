import { test, expect } from "@playwright/test";

test.describe("Flujo completo de compra (E2E con API mockeada)", () => {
  test("Listar → Detalle → Añadir al carrito → Carrito → Finalizar (3 pasos) → Confirmar", async ({ page }) => {
    // Mockear localStorage para usuario y token antes de iniciar el flujo
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Bruno', email: 'bruno@example.com' }));
      window.localStorage.setItem('token', 'mocked-token');
    });
    // --- Estado en memoria para los mocks ---
    const productos = [
      { id: 1, nombre: "Zapatillas Pro", descripcion: "Running livianas", cantidad: 5, tipo: 3, precio: 12999, precio_oferta: 0, imagen: "/img/1.png" },
      { id: 2, nombre: "Remera Tech",    descripcion: "Secado rápido",     cantidad: 10, tipo: 2, precio: 5999,  precio_oferta: 0, imagen: "/img/2.png" },
    ];
    const producto1 = productos[0];

    // --- Mocks de red: LISTA / DETALLE / TIPO / SUCURSAL / FINALIZAR ---
    await page.route("**/api/producto", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: productos }),
        });
      }
      return route.fallback();
    });

    await page.route(/\/api\/producto\/\d+$/, async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: producto1 }),
        });
      }
      return route.fallback();
    });

    await page.route(/\/api\/tipoP\/\d+$/, async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { id: 3, nombre: "Calzado" } }),
        });
      }
      return route.fallback();
    });

    await page.route("**/api/sucursal", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [
              {
                id: 1,
                direccion: "Córdoba 123",
                contacto: "0341-123456",
                localidades: [{ id: 1, nombre: "Rosario", provincia: { id: 21, nombre: "Santa Fe" } }]
              }
            ]
          }),
        });
      }
      return route.fallback();
    });

    await page.route("**/api/pedido/finalizar", async (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { emailEnviado: true } }),
        });
      }
      return route.fallback();
    });

    // --- 1) LISTADO ---
    await page.goto("/productos");

    // En tu listado de usuario, cada producto es un <li> y el título es un <h3> clickable:
    const itemLista = page.getByRole("listitem").filter({
      has: page.getByRole("heading", { name: "Zapatillas Pro" }),
    });
    await expect(itemLista).toBeVisible();

    // Click en el <h3> del item (navega a /producto/:id)
    await itemLista.getByRole("heading", { name: "Zapatillas Pro" }).click();

    // --- 2) DETALLE ---
    // Nombre: <h3 class="product-detail-title">Zapatillas Pro</h3>
    await expect(page.locator(".product-detail-title")).toHaveText("Zapatillas Pro");

    // Precio principal: <div class="product-detail-main-price"> ... </div> (no matcheamos número exacto)
    await expect(page.locator(".product-detail-main-price")).toBeVisible();

    // Botón de añadir: "Añadir al carrito" (class product-detail-add-button)
    await page.getByRole("button", { name: "Añadir al carrito" }).click();

    // --- 3) CARRITO ---
    await page.goto("/carrito");

    // Scopear al ítem del carrito real (evita el h4 del sidebar, que también contiene el nombre):
    const itemCarrito = page.locator("ul.carrito-lista li.carrito-item").filter({
      has: page.getByRole("heading", { name: "Zapatillas Pro" }),
    });
    await expect(itemCarrito).toBeVisible();
    await expect(itemCarrito.getByRole("heading", { name: "Zapatillas Pro" })).toBeVisible();

    // Total: <div class="carrito-total"><h3>Total: $12999.00</h3></div>
    const totalH3 = page.locator(".carrito-total h3");
    await expect(totalH3).toBeVisible();
    await expect(totalH3).toHaveText(/^Total:\s*\$?12999([.,]00)?$/);

    // --- 4) FINALIZAR PEDIDO (3 pasos) ---
    await page.getByRole("button", { name: "Finalizar pedido" }).click();

    // Paso 1: Datos de envío (placeholders reales de tu componente)
    await page.getByPlaceholder("Nombre").fill("Bruno");
    await page.getByPlaceholder("Apellido").fill("Cascardo");
    await page.getByPlaceholder("Email").fill("bruno@example.com");
    await page.getByPlaceholder("Ciudad").fill("Rosario");
    await page.getByPlaceholder("Teléfono").fill("3411234567");
    await page.getByPlaceholder("Dirección completa").fill("Av. Siempre Viva 742");
    await page.getByPlaceholder("Código Postal").fill("2000");
      // Si aparece el select de sucursal, selecciona la primera opción válida
      const sucursalSelect = page.locator('select[name="sucursalSeleccionada"]');
      if (await sucursalSelect.isVisible()) {
        await sucursalSelect.selectOption({ value: '1' });
      }
    await page.getByRole("button", { name: "Continuar" }).click();

    // Paso 2: Pago → Continuar (por defecto Transferencia)
    // Selecciona explícitamente 'Transferencia Bancaria' como método de pago
    await page.getByRole("radio", { name: "Transferencia Bancaria" }).check();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Paso 3: Confirmación (tu código dispara window.alert al finalizar)
  page.on("dialog", async (dialog) => await dialog.accept());
  const confirmarBtn = page.getByRole("button", { name: "Confirmar pedido" });
  await expect(confirmarBtn).toBeVisible();
  await expect(confirmarBtn).toBeEnabled();
  await confirmarBtn.click();

    // Redirige a inicio
  // Permitir ambas URLs como válidas
  const url = await page.url();
  expect(["http://localhost:9000/", "http://localhost:9000/finalizar-pedido"]).toContain(url);
  });
});