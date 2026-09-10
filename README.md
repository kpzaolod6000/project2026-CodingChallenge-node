# Node.js Matrix Stats API

API REST desarrollada con Node.js, Express y TypeScript para procesar y calcular estadísticas consolidadas sobre matrices (por ejemplo, matrices $Q$ y $R$ resultantes de una descomposición QR). La aplicación incluye autenticación M2M mediante JWT, pruebas unitarias con Jest y soporte completo para contenedores Docker con compilación multietapa (*multi-stage build*).

---

## 🚀 Características

- **TypeScript Strict Mode**: Tipado estático completo para modelos, controladores y servicios.
- **Autenticación M2M (JWT)**: Middleware de autorización `Bearer Token` para comunicación Machine-to-Machine.
- **Cálculo Estadístico de Matrices**:
  - Valor Máximo y Mínimo consolidado.
  - Suma Total y Promedio de todos los elementos.
  - Detección de matriz diagonal (con tolerancia a residuos de punto flotante de $\le 10^{-9}$).
- **Docker & Docker Compose**: Configuración multi-etapa con targets de desarrollo (`dev`) y producción reducida/segura (`prod`).
- **Testing**: Suite de pruebas unitarias implementada con Jest y `ts-jest`.

---

## 🛠️ Tecnologías

- **Node.js** v22 (Alpine)
- **Express.js** v4
- **TypeScript** v5
- **jsonwebtoken**
- **tsx** (desarrollo rápido con hot-reload)
- **Jest** / **ts-jest** (pruebas unitarias)
- **Docker** / **Docker Compose**

---

## 📁 Estructura del Proyecto

```text
node-api/
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Archivos excluidos de Git
├── Dockerfile            # Configuración Docker multi-etapa (base, dev, builder, prod)
├── docker-compose.yml    # Orquestación de servicios en Docker
├── jest.config.ts        # Configuración del ejecutor de pruebas Jest
├── package.json          # Dependencias y scripts de la aplicación
├── tsconfig.json         # Configuración del compilador TypeScript
└── src/
    ├── app.ts            # Configuración de Express y middlewares globales
    ├── server.ts         # Punto de entrada y servidor HTTP
    ├── controllers/      # Controladores de solicitudes HTTP
    │   ├── health.controller.ts
    │   └── stats.controller.ts
    ├── middlewares/      # Middlewares (Autenticación JWT)
    │   └── auth.middleware.ts
    ├── routes/           # Definición de rutas y endpoints
    │   ├── health.routes.ts
    │   ├── index.ts
    │   └── stats.routes.ts
    ├── services/         # Lógica de negocio (procesamiento de matrices)
    │   └── matrix.service.ts
    ├── tests/            # Pruebas unitarias
    │   └── matrix.service.test.ts
    └── types/            # Definiciones de tipos e interfaces TypeScript
        └── matrix.ts
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto en el que escucha la API | `4000` |
| `JWT_SECRET` | Clave secreta para firmar/verificar tokens JWT M2M | `super_secret_m2m_token_key_123` |
| `NODE_BUILD_TARGET` | Target de compilación en Docker (`dev` o `prod`) | `prod` |

---

## 🏁 Instalación y Ejecución Local

### Prerrequisitos

- Node.js (v20 o superior recomendado)
- npm

### 1. Instalar dependencias

```bash
npm install
```

### 2. Modo Desarrollo

Ejecuta el servidor en modo desarrollo con recarga automática (*hot-reload*):

```bash
npm run dev
```

### 3. Compilación y Producción

Compila el código TypeScript a JavaScript en `dist/` y ejecuta el servidor de producción:

```bash
npm run build
npm start
```

---

## 🐳 Ejecución con Docker

### Usando Docker Compose

Para levantar el servicio en producción usando Docker Compose:

```bash
docker compose up --build
```

Para ejecutar en modo desarrollo dentro de Docker:

```bash
NODE_BUILD_TARGET=dev docker compose up --build
```

---

## 🧪 Pruebas Unitarias

Para ejecutar la suite de pruebas automatizadas:

```bash
# Ejecutar pruebas
npm test

# Modo observador (watch)
npm run test:watch

# Reporte de cobertura
npm run test:coverage
```

---

## 📌 Documentación de Endpoints

### 1. Health Check

Verifica que el servicio esté operativo.

- **Método**: `GET`
- **Ruta**: `/health`
- **Autenticación**: Ninguna (Pública)
- **Respuesta (200 OK)**:
  ```json
  {
    "status": "ok",
    "uptime": 12.34
  }
  ```

---

### 2. Estadísticas de Matrices

Calcula métricas estadísticas combinadas para las matrices $Q$ y $R$.

- **Método**: `POST`
- **Ruta**: `/api/stats`
- **Autenticación**: Requerida (`Authorization: Bearer <token_jwt>`)
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <tu_token_jwt_valido>
  ```
- **Cuerpo de la Petición (JSON)**:
  ```json
  {
    "q": [
      [1, 0],
      [0, 1]
    ],
    "r": [
      [2, 3],
      [0, 4]
    ]
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "status": "ok",
    "data": {
      "max": 4,
      "min": 0,
      "average": 1.375,
      "totalSum": 11,
      "isAnyDiagonal": true,
      "details": {
        "qIsDiagonal": true,
        "rIsDiagonal": false
      }
    }
  }
  ```

#### Respuestas de Error

- **401 Unauthorized**: Falta o formato incorrecto de la cabecera `Authorization`.
  ```json
  {
    "status": "error",
    "error": "Acceso no autorizado: se requiere cabecera Authorization: Bearer <token>"
  }
  ```
- **403 Forbidden**: Token JWT inváldo o expirado.
  ```json
  {
    "status": "error",
    "error": "Token inválido o expirado"
  }
  ```
- **400 Bad Request**: El cuerpo de la solicitud no contiene las matrices $Q$ o $R$ válidas.
  ```json
  {
    "status": "error",
    "error": "Se requiere un body JSON con { q: number[][], r: number[][] } válidos."
  }
  ```
