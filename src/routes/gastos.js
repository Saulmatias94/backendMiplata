const { Router } = require('express');
const router = Router();

const GastosController = require('../controllers/GastosController');


router.post('/miplata/gastos', GastosController.registerGastos);
router.get('/miplata/gastos', GastosController.getAllGastos);
router.get('/miplata/gastos/:id',  GastosController.getById);

module.exports = router;