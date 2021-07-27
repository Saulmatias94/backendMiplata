const { Router } = require('express');
const router = Router();

const IngresosController = require('../controllers/IngresosController');

router.post('/miplata/ingresos',  IngresosController.registerIngreso);
router.get('/miplata/ingresos', IngresosController.getAllIngresos);
router.get('/miplata/ingresos/:id', IngresosController.getById);

module.exports = router;