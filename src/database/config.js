// Conexión a la base de datos
const mongoose = require('mongoose');


const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

const dbConnection = () => {
  mongoose.connect(process.env.MONGODB_URI, options)
  /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
	  .then(() => console.log('Connected database'))
	  .catch(e => console.log('DB Error:', e))
}

module.exports = dbConnection;