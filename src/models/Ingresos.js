const { Schema, model } = require('mongoose');

const ingresosSchema = new Schema({
    ingreso: { type: Number, required: true },
    tipo: { type: String, required: true },
    dia: { type: Number, required: true },
    mes: { type: String, required: true },
    año: { type: Number, required: true },
    usuario: { type: String, required: true},
    isVerified: { type: Boolean, default: true },
    verificationToken: String,
    created: { type: Date, default: Date.now },
    updated: Date
});

module.exports = model('Ingresos', ingresosSchema);