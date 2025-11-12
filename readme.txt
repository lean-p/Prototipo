📋 Prerrequisitos
Antes de empezar, asegúrate de tener instalado el siguiente software en tu máquina:

Node.js (versión 18 o superior)

npm (generalmente se instala con Node.js)

Un servidor de base de datos MySQL (como MySQL Community Server o XAMPP)

⚙️ Guía de Instalación
Para levantar el proyecto completo, necesitarás configurar tanto el backend como el frontend.

1. Configuración del Backend (Servidor)
La package.json del backend se encuentra en la raíz del proyecto.

Instalar Dependencias del Backend En la carpeta /src, ejecuta:

npm install

2. Configurar la Base de Datos (MySQL)

Ejecuta los archivos SQL que se encuentran en la carpeta /dbscript en tu cliente de MySQL (como MySQL Workbench o phpMyAdmin) para crear las bases de datos y las tablas necesarias.

3. Configurar las Variables de Entorno

En la raíz del backend (/Prototipo), encontrarás un archivo llamado config.env.example.

Crea una copia de este archivo en la misma carpeta y renuévalo a config.env.

Abre config.env y rellena las variables, especialmente:

DB_NAME="base_transaccional"
DBDW_NAME="base_datawarehouse"
DB_USER="usuario"
DB_PASSWORD="clave"
DB_HOST="ip_host"
PORT="puerto"
JWT_SECRET="Secreto_largo_y_dificil_de_adivinar"
FX_CLIENT_ID="Client_ID_De_Fedex"
FX_CLIENT_SECRET="Client_Secret_De_Fedex"
DHL-API-Key="API_KEY_de_DHL"


4. Crear Carpeta temp (Instrucción Manual)

Dentro de la carpeta src de tu backend, crea una nueva carpeta llamada temp. (Nota: Esto es necesario para que el servicio de generación de reportes CSV funcione correctamente).

5. Configuración del Frontend (Cliente React)
El frontend vive en su propia carpeta y tiene sus propias dependencias.

Navegar a la Carpeta del Frontend Desde la raíz del proyecto:

cd frontend

Instalar Dependencias del Frontend

npm install

🏃‍♂️ Cómo Correr la Aplicación
Para que la aplicación funcione, necesitas tener dos terminales abiertas al mismo tiempo: una para el backend y otra para el frontend.

Terminal 1: Correr el Backend
Asegúrate de estar en la carpeta raíz del proyecto (/Prototipo).

Ejecuta el script de desarrollo:

npm run dev

El backend estará corriendo en http://localhost:3000 (o el puerto que hayas configurado en config.env).


Terminal 2: Correr el Frontend (Vite)
Abre una nueva terminal.

Navega a la carpeta del frontend:

cd frontend

Ejecuta el script de desarrollo de Vite:

npm run dev

Vite estará corriendo en http://localhost:5137

Abre http://localhost:5137 en tu navegador para usar la aplicación.

