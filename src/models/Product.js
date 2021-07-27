const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
	autor: { type: String, required: true },
	titulo: { type: String, required: true },
	descripcion: { type: String, required: true, },
    categorias: [{
        type: String, required: true,
    }]
}, {
	timestamps: true
})

module.exports = model('Product', ProductSchema);