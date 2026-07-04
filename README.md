# GastroCloud - Sistema de Gestión Gastronómica

Sistema web completo de gestión para restaurantes y negocios gastronómicos, desarrollado con **Express.js**, **TypeScript**, **PostgreSQL** y **EJS**.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
  - Descargar desde: https://nodejs.org/
  
- **PostgreSQL** (versión 12 o superior)
  - Descargar desde: https://www.postgresql.org/download/
  - Durante la instalación, anota las credenciales (usuario y contraseña)
  - Por defecto: usuario `postgres` / contraseña `postgres`

## Instalación y Configuración

### 1. Clonar o descargar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd GastroCloude
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos (Opcional)

La aplicación crea automáticamente la base de datos y las tablas, pero si prefieres hacerlo manualmente:

1. Abre PostgreSQL con pgAdmin o desde la terminal:
   ```bash
   psql -U postgres
   ```

2. Crea la base de datos:
   ```sql
   CREATE DATABASE gastrocloud;
   ```

3. Sale con `\q`

### 4. Configurar variables de entorno (Opcional)

Si necesitas cambiar la configuración por defecto, crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto de la aplicación
PORT=3000

# Configuración de base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gastrocloud
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# Sesión
SESSION_SECRET=tu-secreto-seguro-aqui

# Credenciales de demostración (opcionales)
DEMO_ADMIN_USERNAME=admin
DEMO_ADMIN_EMAIL=admin@gastrocloud.local
DEMO_ADMIN_PASSWORD=Admin123*
DEMO_EMPLOYEE_USERNAME=empleado
DEMO_EMPLOYEE_EMAIL=empleado@gastrocloud.local
DEMO_EMPLOYEE_PASSWORD=Empleado123*
```

**Nota:** Si no creas el archivo `.env`, la aplicación usará valores por defecto que funcionan con una instalación estándar de PostgreSQL.

## Ejecutar la Aplicación

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Compilar TypeScript a JavaScript

```bash
npm run build
```

### Ejecutar producción (después de compilar)

```bash
npm start
```

## Credenciales de Prueba

Después de instalar, puedes acceder con estas credenciales:

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `Admin123*`

### Empleado
- **Usuario:** `empleado`
- **Contraseña:** `Empleado123*`

## Estructura del Proyecto

```
src/
├── config/          # Configuración (BD, sesiones, variables de entorno)
├── controllers/     # Controladores (lógica de las rutas)
├── enums/          # Enumeraciones
├── interfaces/     # Interfaces TypeScript
├── middlewares/    # Middlewares (autenticación, validación, etc)
├── models/         # Modelos de Sequelize (ORM)
├── repositories/   # Capa de acceso a datos
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
├── types/          # Tipos TypeScript personalizados
├── utils/          # Utilidades
├── validators/     # Validadores
├── views/          # Plantillas EJS
└── public/         # Archivos estáticos (CSS, JS, imágenes)
```

## Solución de Problemas

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Problema:** PostgreSQL no está corriendo.
**Solución:** 
- En Windows: Abre Services y busca "PostgreSQL" y reinícialo
- En Linux: `sudo service postgresql start`
- En Mac: `brew services start postgresql`

### Error: "FATAL: role 'postgres' does not exist"
**Problema:** Usuario postgres no existe o la contraseña es incorrecta.
**Solución:** Revisa tu instalación de PostgreSQL y actualiza las credenciales en `.env`

### Error: "database 'gastrocloud' does not exist"
**Problema:** La base de datos no se creó automáticamente.
**Solución:** Ejecuta el paso 3 de "Configuración de la base de datos" manualmente.

### La aplicación no inicia
**Solución:** Revisa que:
- Node.js está instalado: `node --version`
- PostgreSQL está corriendo
- Puerto 3000 no está ocupado
- Ejecutaste `npm install`

## Notas Importantes

- La aplicación sincroniza automáticamente los modelos con la base de datos al iniciar
- Si eliminas la BD, la próxima vez que inicies la app la recreará automáticamente
- Los datos de demostración se insertan en la primera ejecución

## Para Compañeros

¿Tu compañero quiere probarlo también? Solo necesita:
1. Descargar/clonar el repositorio
2. Ejecutar `npm install`
3. Tener PostgreSQL instalado (o usar valores por defecto si está localmente)
4. Ejecutar `npm run dev`

¡Listo!

## Soporte

Si tienes problemas, verifica que:
- Node.js esté instalado
- PostgreSQL esté corriendo
- Las dependencias se instalaron correctamente (`npm install`)
- El puerto 3000 esté disponible
