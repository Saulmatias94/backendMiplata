const Ingresos = require('../models/Ingresos');

const createIngresos = async (req, res) => {
    try {
        const newIngresos = await Ingresos.create(req.body);
        res.status(201).send(newIngresos);
    } catch (error) {
        res.status(500).send({ 'error': error });
    }
};
const getAllIngresos = async (req, res) => {
    try {
      const ingresos = await Ingresos.find();
      res.json(ingresos);
    } catch (error) {
      return res.status(400).json({ 'error': error })
    }
  };

  async function registerIngreso(req, res) {

    const newIngreso = new Ingresos({
        ingreso: req.body.ingreso,
        tipo: req.body.tipo,
        dia: req.body.dia,
        mes: req.body.mes,
        año: req.body.año,
        usuario: req.body.usuario      
    })

    Ingresos.create(newIngreso).then(() => {
        res.status(201).send('Registro exitoso');
    }).catch(error => {
        res.status(400).send({ error });
    })


}
async function getById(req, res) {
    const user = await Ingresos.find({usuario: req.params.id});
    if (!user) return res.status(404).send({ error: 'Usuario no encontrado' })
    return res.send(user);
  }


module.exports = {
    createIngresos,
    getAllIngresos,
    registerIngreso,
    getById
};