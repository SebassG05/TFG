# 24Seconds - Plataforma de Basket y Comunidad

24Seconds es una plataforma web integral que combina e-commerce, comunidad y eventos para los amantes del baloncesto y las zapatillas. El proyecto está compuesto por un frontend moderno desarrollado en Angular y un backend robusto basado en Node.js, Express y MongoDB. Incluye funcionalidades avanzadas como recomendaciones con IA, sorteos, eventos, panel de administración, pagos online y mucho más.

---

## Índice
- [Descripción General](#descripción-general)
- [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
- [Principales Funcionalidades](#principales-funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Despliegue y Calidad](#despliegue-y-calidad)
- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Documentación de la API](#documentación-de-la-api)

---

## Descripción General

24Seconds nace con el objetivo de ofrecer una experiencia única a los fans del basket, permitiendo no solo comprar zapatillas y productos exclusivos, sino también participar en sorteos, eventos, y formar parte de una comunidad activa. El sistema está preparado para escalar y adaptarse a diferentes roles de usuario: clientes, proveedores y administradores.

El backend expone una API RESTful segura y bien documentada, mientras que el frontend proporciona una interfaz atractiva, responsiva y dinámica, optimizada para cualquier dispositivo.

---

## Arquitectura y Tecnologías

### Backend
- **Node.js & Express**: Motor principal de la API REST.
- **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
- **Zod**: Validación de datos robusta en endpoints.
- **JWT**: Autenticación y autorización segura.
- **Nodemailer**: Envío de emails (notificaciones, recuperación de contraseña, etc).
- **Swagger**: Documentación interactiva de la API.
- **Cloudinary**: Almacenamiento y gestión de imágenes en la nube.
- **OpenAI API**: Recomendaciones inteligentes de zapatillas mediante IA.
- **Docker & Docker Compose**: Contenerización y despliegue sencillo.
- **SonarQube**: Análisis de calidad y seguridad del código.

### Frontend
- **Angular**: Framework SPA para el desarrollo del frontend.
- **TypeScript**: Lenguaje principal para robustez y escalabilidad.
- **Tailwind CSS**: Utilidades CSS para un diseño moderno y responsivo.
- **Angular Material**: Componentes UI profesionales.
- **RxJS**: Programación reactiva y gestión de estados.
- **Chart.js**: Visualización de datos y estadísticas.
- **Three.js**: Efectos y animaciones 3D.
- **AOS, Animate.css, Particles.js**: Animaciones y efectos visuales.

![Stack Tecnológico Backend](src/public/Backend.png)
---

## Principales Funcionalidades

- **Registro y autenticación de usuarios** (clientes, proveedores, admins)
- **Gestión de productos**: alta, edición, borrado, votación y ranking
- **Carrito de la compra y pagos online**
- **Panel de usuario y panel de administración**
- **Participación en sorteos y eventos**
- **Recomendación de zapatillas mediante IA**
- **Subida y gestión de imágenes en la nube**
- **Notificaciones y emails automáticos**
- **Documentación Swagger para la API**
- **Despliegue con Docker y control de calidad con SonarQube**

---

## Estructura del Proyecto

### Backend
- **src/config/**: Configuración general y Swagger
- **src/models/**: Modelos de datos (usuarios, productos, pedidos, etc.)
- **src/controllers/**: Lógica de negocio
- **src/routes/**: Endpoints de la API
- **src/schemas/**: Validaciones y esquemas Swagger
- **src/middlewares/**: Seguridad, validación y logs
- **src/utils/**: Utilidades y helpers
- **src/public/**: Archivos estáticos
- **src/app.js / src/index.js**: Inicialización de la app

### Frontend
- **src/app/**: Componentes, servicios y rutas principales
- **src/assets/**: Imágenes y recursos estáticos
- **src/environments/**: Configuración de entornos
- **angular.json / tailwind.config.js**: Configuración global

---

## Despliegue y Calidad
- **Docker**: Permite levantar el backend, frontend y base de datos con un solo comando.
- **SonarQube**: Analiza el código para asegurar calidad y seguridad.
- **Render/Vercel**: Despliegue automático en la nube.

---

## Cómo Ejecutar el Proyecto

1. Clona el repositorio y entra en la carpeta del backend:
   ```powershell
   git clone <repo-url>
   cd backend
   npm install
   ```
2. Configura las variables de entorno en un archivo `.env` (puedes usar `.env.example` como referencia).
3. Arranca el backend:
   ```powershell
   npm start
   ```
4. Para el frontend:
   ```powershell
   cd ../24Seconds
   npm install
   npm start
   ```
5. Accede a la web en [http://localhost:4200](http://localhost:4200) y a la documentación de la API en [http://localhost:4000/api-docs](http://localhost:4000/api-docs) (o el puerto que uses).

---

## Documentación de la API

La API está documentada con Swagger. Puedes probar todos los endpoints y ver los esquemas de datos accediendo a:
- [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## Créditos y agradecimientos

Este proyecto ha sido desarrollado como Trabajo de Fin de Grado, integrando tecnologías modernas y buenas prácticas de desarrollo web. Gracias a la comunidad open source y a todos los recursos que han hecho posible este proyecto.

---


