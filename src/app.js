const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const https = require('https');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const dbConnection = require('./database/config');
const app = express();

// Middleware
app.use(morgan('tiny'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// middlewares
app.use(fileUpload()); // enable files upload

//coneccion a mongoDB
dbConnection();
//Archivo publico 
app.use('/public', express.static(__dirname + '/public'));

// Rutas
app.get('/', (req, res, next) => {
  res.send('Ruta raiz');
});

app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/ingresos'));
app.use('/api', require('./routes/gastos'));

const sslServer = {

  cert: fs.readFileSync(path.join(__dirname, 'cert', 'my_cert.crt')),
  key: fs.readFileSync(path.join(__dirname, 'cert', 'my_cert.key'))
}

https.createServer(sslServer, app)
  .listen(3443, function () {
    console.log('Secure server on port 3443')
  })



//app.set('port', process.env.PORT || 3000);
//app.listen(app.get('port'), function () {
//  console.log(`App running at port: http://localhost:${app.get('port')}`);
//});