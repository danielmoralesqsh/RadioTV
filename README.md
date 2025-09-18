# StreamVerse

StreamVerse es una plataforma interactiva de transmisión de medios que permite a los usuarios ver canales de televisión y escuchar emisoras de radio en línea. Diseñada para ser una solución de entretenimiento sencilla y accesible, StreamVerse ofrece una experiencia de usuario fluida para disfrutar de contenido multimedia en vivo.

## Características

*   **Canales de TV en Vivo:** Accede a una selección de canales de televisión en español, incluyendo noticias, deportes y entretenimiento.
*   **Emisoras de Radio en Vivo:** Sintoniza una variedad de emisoras de radio en español, con opciones de música, noticias y tertulias.
*   **Interfaz Intuitiva:** Navegación sencilla y diseño limpio para una experiencia de usuario agradable.
*   **Reproductor Integrado:** Reproductores de video y audio optimizados para una reproducción fluida.
*   **Búsqueda de Canales/Emisoras:** Encuentra rápidamente tu contenido favorito.
*   **Diseño Responsivo:** Disfruta de la aplicación en diferentes dispositivos y tamaños de pantalla.

## Tecnologías Utilizadas

*   **Framework:** Next.js (con App Router y Turbopack para desarrollo rápido)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS
*   **Componentes UI:** Shadcn UI
*   **Streaming de Video:** `hls.js` para la reproducción de streams HLS.

## Primeros Pasos

Para configurar y ejecutar el proyecto en tu entorno local, sigue estos pasos:

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/danielmoralesqsh/RadioTV.git
    cd RadioTV
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### Ejecutar en Modo Desarrollo

Para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:9002`.

### Construir para Producción

Para construir la aplicación para despliegue en producción:

```bash
npm run build
```

### Ejecutar en Modo Producción

Para iniciar la aplicación construida en modo producción:

```bash
npm run start
```

### Análisis Estático y Verificación de Tipos

Para ejecutar el linter y el verificador de tipos:

```bash
npm run lint
npm run typecheck
```

## Estructura del Proyecto

La estructura principal del proyecto es la siguiente:

```
. 
├── public/                 # Archivos estáticos (favicon, etc.)
├── src/
│   ├── app/                # Rutas y páginas principales (TV, Radio, Home)
│   │   ├── tv/             # Lógica y componentes específicos de TV
│   │   └── radio/          # Lógica y componentes específicos de Radio
│   ├── components/         # Componentes UI reutilizables (botones, tarjetas, etc.)
│   │   ├── layout/         # Componentes de diseño (sidebar)
│   │   ├── ui/             # Componentes de Shadcn UI
│   │   └── ...
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilidades y funciones de ayuda
│   └── types/              # Definiciones de tipos de TypeScript
├── .gitignore              # Archivos y directorios ignorados por Git
├── package.json            # Dependencias y scripts del proyecto
├── next.config.ts          # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Este archivo
```
## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
