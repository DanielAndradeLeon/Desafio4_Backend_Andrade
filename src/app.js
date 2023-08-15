const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const filePathProducts = path.join(__dirname, 'products.json');
const filePathCarts = path.join(__dirname, 'carritos.json');

app.use(express.json());

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// Endpoint para la vista home
app.get('/', (req, res) => {
  // Leer productos del archivo JSON
  fs.readFile(filePathProducts, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo products.json:', err);
      return res.status(500).send('Error al obtener los productos.');
    }

    const products = JSON.parse(data);

    // Renderizar la vista home con la lista de productos
    res.render('home', { products });
  });
});

// Endpoint para la vista en tiempo real de productos
app.get('/realtimeproducts', (req, res) => {
  // Leer productos del archivo JSON
  fs.readFile(filePathProducts, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo products.json:', err);
      return res.status(500).send('Error al obtener los productos.');
    }

    const products = JSON.parse(data);

    // Renderizar la vista de productos en tiempo real con la lista de productos
    res.render('realTimeProducts', { products });
  });
});

// Configurar socket.io para conexiones en tiempo real
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar el evento 'newProduct' para recibir nuevos productos desde el cliente
  socket.on('newProduct', (newProduct) => {
    console.log('Nuevo producto recibido:', newProduct);

    // Leer productos del archivo JSON
    fs.readFile(filePathProducts, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo products.json:', err);
        return;
      }

      const products = JSON.parse(data);

      // Agregar el nuevo producto a la lista
      products.push(newProduct);

      // Guardar la lista actualizada de productos en el archivo JSON
      fs.writeFile(filePathProducts, JSON.stringify(products, null, 2), (err) => {
        if (err) {
          console.error('Error al escribir en el archivo products.json:', err);
        } else {
          // Emitir el evento 'updateProducts' a todos los clientes conectados
          io.emit('updateProducts', products);
        }
      });
    });
  });
});

// Iniciar el servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



