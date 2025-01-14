# Imagen base
FROM node:16-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 4200

# Comando para correr la aplicación
CMD ["ng", "serve"]