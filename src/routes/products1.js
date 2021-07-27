const { Router } = require('express');
const router = Router();

// Importamos el modelo Produtct 
const Product = require('../models/Product')

const Middleware = require('../middlewares/checkProductFields')
// Agregar un producto si 
router.post('/', async (req, res) => {
	Product.create(req.body).then(() => {
		res.status(201).send('Producto creado con exito')
	}).catch(error => {
		res.status(400).send({ 'error': error });
	})
});

// Obtener todos los documentos nooo 
router.get('/', async(req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});

// Obtener un documento en específico si
router.get('/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findOne({_id});
    res.json(product);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});

router.get('/autor/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.find({autor: _id});
    res.json(product);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});
router.get('/categorias/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.find({categorias: _id});
    res.json(product);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});
// Eliminar un producto 
router.delete('/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete({_id});
    if(!product){
      return res.status(404).json({
        error: "Producto no encontrado"
      })
    }
    res.json(product);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});

// Actualizar una producto si
router.put('/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByIdAndUpdate(_id, req.body);
    res.json(product);  
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
});

// Exportamos la configuración de express app
module.exports = router;