# Test unitario: Componente Producto

Este proyecto incluye un test unitario para el componente `Producto` ubicado en `front/src/components/Producto/Producto.test.tsx`.

## ¿Qué verifica el test?

## Instalación de dependencias

1. Abrí una terminal en la carpeta `dsw/front`.
2. Instalá las dependencias necesarias:

	npm install

## Ejecución de los tests

En la misma carpeta `dsw/front`, ejecutá:

npm test

Esto ejecutará todos los tests unitarios, incluyendo el de Producto. Verás el resultado en la terminal.

# Test End-to-End: Flujo de compra

Este proyecto incluye un test E2E automatizado para el flujo completo de compra, ubicado en `front/e2e/flow-producto.e2e.spec.ts` y ejecutado con Playwright.

## ¿Qué verifica el test?
- Simula el proceso de compra desde el listado de productos hasta la confirmación final.
- Mockea las respuestas de la API para productos, sucursales y pedido.
- Completa los formularios de envío y pago, y confirma el pedido.
- Verifica que los elementos clave de la UI aparezcan y funcionen correctamente.

## Ejecución del test E2E

1. Abrí una terminal en la carpeta `dsw/front`.
2. Instalá las dependencias necesarias:

	npm install

3. Ejecutá el test E2E:

	npm run e2e

Esto lanzará Playwright, levantará el servidor local y ejecutará el flujo completo de compra. Los resultados, videos y screenshots de los tests se guardan en la carpeta `test-results`.


