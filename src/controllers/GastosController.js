const Gastos = require('../models/Gastos');

const createGastos = async (req, res) => {
  try {
    const newIngresos = await Gastos.create(req.body);
    res.status(201).send(newIngresos);
  } catch (error) {
    res.status(500).send({ 'error': error });
  }
};
const getAllGastos = async (req, res) => {
  try {
    const gastos = await Gastos.find();
    res.json(gastos);
  } catch (error) {
    return res.status(400).json({ 'error': error })
  }
};

async function registerGastos(req, res) {

  const newGasto = new Gastos({
    gasto: req.body.gasto,
    tipo: req.body.tipo,
    dia: req.body.dia,
    mes: req.body.mes,
    año: req.body.año,
    usuario: req.body.usuario
  })

  Gastos.create(newGasto).then(() => {
    res.status(201).send('Registro exitoso');
  }).catch(error => {
    res.status(400).send({ error: 'aqui' });
  })


};
async function getById(req, res) {
  const user = await Gastos.find({ usuario: req.params.id });
  if (!user) return res.status(404).send({ error: 'Usuario no encontrado' })
  return res.send(user);
}


module.exports = {
  createGastos,
  getAllGastos,
  registerGastos,
  getById
};