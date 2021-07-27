const checkProductFields = (req, res, next) => {
	const { product_autor, product_titulo, product_descripcion, product_categorias } = req.body
	if (product_autor === '') {
		return res.status(400).json({ error: 'El campo Autor es requerido.'})
	} else if (product_titulo === '') {
		return res.status(400).json({ error: 'El campo Titulo es requerido.' })
	} else if (product_descripcion === '') {
		return res.status(400).json({ error: 'El campo Descripcion debe ser mayor a 0.' })
	} 
	next();
}
module.exports = checkProductFields