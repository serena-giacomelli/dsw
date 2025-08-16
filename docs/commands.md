
## Inicializar el proyecto localmente

1. Instalar dependencias:
    ```powershell
    npm i
    ```
2. Iniciar el frontend:
    ```powershell
    npm run startFront
    ```
3. Iniciar el backend:
    ```powershell
    npm run startBack
    ```

---


## Acceso a la API y Frontend en producción

- **Frontend (InfinityFree):**
  [https://lusechi.infinityfree.me/](https://lusechi.infinityfree.me/)
  - Desplegado usando FileZilla.

### ¿Cómo usar FileZilla para subir el frontend?

1. Descargá e instalá FileZilla versión 3.62.2 desde:
  [https://filezilla-project.org/download.php?show_all=1](https://filezilla-project.org/download.php?show_all=1)
  (Seleccioná la versión 3.62.2 para tu sistema operativo)
2. Abrí FileZilla y conectate con los datos FTP que te da InfinityFree:
   - **Host:** (ejemplo: ftpupload.net)
   - **Usuario:** (tu usuario FTP)
   - **Contraseña:** (tu contraseña FTP)
3. Una vez conectado, navegá en el panel derecho hasta la carpeta `htdocs`.
4. Arrastrá los archivos del frontend (por ejemplo, el contenido de la carpeta `build` o `dist`) desde tu PC (panel izquierdo) a la carpeta `htdocs` (panel derecho).
5. Esperá a que termine la transferencia. Tu sitio estará disponible en el link de InfinityFree.

- **Backend (Render):**
  [https://dswback.onrender.com/](https://dswback.onrender.com/)
  - Desplegado en Render.

---

Para cualquier consulta sobre el despliegue o comandos, contactanos.
