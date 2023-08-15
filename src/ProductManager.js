//Curso Programación Backend 47275   
//Tercer Desafío Entregable
//Daniel Andrade

const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.productIdCounter = 1;
    this.path = filePath;
    this.loadFromFile();
  }

  // Método para cargar los productos desde el archivo
  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);

      // Verificar si el archivo contiene un arreglo válido de productos
      if (!Array.isArray(this.products)) {
        throw new Error('El archivo products.json no contiene un arreglo válido.');
      }

      // Actualizar el contador de IDs basado en el último producto en la lista
      if (this.products.length > 0) {
        const lastProduct = this.products[this.products.length - 1];
        this.productIdCounter = lastProduct.id + 1;
      }
    } catch (error) {
      // Si el archivo no existe o está vacío, inicializar el arreglo de productos
      this.products = [];
    }
  }

  // Método para guardar los productos en el archivo
  saveToFile() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  // Método para agregar un nuevo producto
  addProduct(productData) {
    // Extraer los datos del objeto productData
    const { id, codigo, nombre, categoria, descripcion, img, precio, stock } = productData;

    // Validar que todos los campos sean obligatorios
    if (!id || !codigo || !nombre || !categoria || !descripcion || !img || !precio || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Verificar si el código ya existe en algún producto
    const existingProduct = this.products.find((product) => product.codigo === codigo);
    if (existingProduct) {
      throw new Error('El código del producto ya está en uso.');
    }

    // Crear un nuevo producto con los datos proporcionados y el contador de IDs
    const newProduct = {
      id: id,
      codigo: codigo,
      nombre: nombre,
      categoria: categoria,
      descripcion: descripcion,
      img: img,
      precio: precio,
      stock: stock,
    };

    // Incrementar el contador de IDs para el siguiente producto
    this.productIdCounter++;

    // Agregar el nuevo producto al arreglo de productos
    this.products.push(newProduct);

    // Guardar los productos en el archivo
    this.saveToFile();
  }

  // Método para obtener todos los productos
  getProducts() {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Retornar todos los productos
    return this.products;
  }

  // Método para obtener un producto por su ID
  getProductById(productId) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Buscar el producto por ID
    const product = this.products.find((product) => product.id === productId);

    // Si no se encuentra el producto, mostrar un error en la consola
    if (!product) {
      console.error('Producto no encontrado.');
    }

    // Retornar el producto encontrado
    return product;
  }

  // Método para actualizar un producto existente
  updateProduct(productId, updatedProductData) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Buscar el índice del producto a actualizar
    const index = this.products.findIndex((product) => product.id === productId);

    // Si el producto no se encuentra, mostrar un error en la consola
    if (index === -1) {
      console.error('Producto no encontrado.');
      return;
    }

    // Extraer los datos del objeto updatedProductData
    const { id, codigo, nombre, categoria, descripcion, img, precio, stock } = updatedProductData;

    // Crear un objeto actualizado con los datos proporcionados
    const updatedProduct = {
      id: id,
      codigo: codigo,
      nombre: nombre,
      categoria: categoria,
      descripcion: descripcion,
      img: img,
      precio: precio,
      stock: stock,
    };

    // Actualizar el producto en el arreglo
    this.products[index] = updatedProduct;

    // Guardar los productos actualizados en el archivo
    this.saveToFile();
  }

  // Método para eliminar un producto por su ID
  deleteProduct(productId) {
    // Cargar los productos desde el archivo
    this.loadFromFile();

    // Filtrar los productos excluyendo el producto a eliminar
    this.products = this.products.filter((product) => product.id !== productId);

    // Guardar los productos actualizados en el archivo
    this.saveToFile();
  }
}

const filePath = './data/products.json';
const manager = new ProductManager(filePath);

module.exports = ProductManager;

  