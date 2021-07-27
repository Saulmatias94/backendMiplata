const User = require('../models/User');
const verifyToken = require('./verifyToken');

// Middleware para validar el rol del usuario
function verifyRole(roles = []) {
    return [
        verifyToken,
        async (req, res, next) => {
            const user = await User.findById(req.user.id);

            if (!user || (roles.length && !roles.includes(user.rol))) {
                // El usuario no existe o no tiene el rol necesario
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // autorización exitosa
            // guardamos el usuario en req para poder acceder a el en futuras funciones
            req.user = user;
            next();
        }
    ];
}

module.exports = verifyRole;