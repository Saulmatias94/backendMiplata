const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Role = require('../helpers/role');
const fs = require('fs');
const { fullURL, randomTokenString } = require('../helpers/utils');
const { sendPasswordResetEmail } = require('../helpers/mail/templates');
const { schemaRegister, schemaLogin, schemaBasicData, schemaUpdatePassword, forgotPasswordSchema, resetPasswordSchema, schemaBasicData1 } = require('../helpers/joi/schemaValidate');


async function register(req, res) {
    // Validamos que los datos cumplen con la estructura del schemaRegister
    const { error } = schemaRegister.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Validamos que el email no se encuentra en nuestra base de datos
    const isEmailExist = await User.findOne({ correo: req.body.correo });
    if (isEmailExist) {
        return res.status(400).json({ error: 'Email ya registrado' })
    }
    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.contraseña, salt);

    const newUser = new User({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        foto: fullURL(req) + '/public/avatar/default.png',
        correo: req.body.correo,
        contraseña: password,
        educacion: req.body.educacion,
        fecha: req.body.fecha
    })

    // El primer usuario que se registre tendra el rol de Admin
    const isFirstuser = (await User.countDocuments({})) === 0;
    newUser.rol = isFirstuser ? Role.Admin : Role.User;

    User.create(newUser).then(() => {
        res.status(201).send('Registro exitoso');
    }).catch(error => {
        res.status(400).send({ error });
    })


}
async function login(req, res) {
    // Validamos los datos
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Buscamos el usuario en la base de datos
    const user = await User.findOne({ correo: req.body.correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!user.isVerified) return res.status(400).json({ error: 'Revisa tu correo electrónico para verificar tu cuenta' });

    const validPassword = await bcrypt.compare(req.body.contraseña, user.contraseña);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

    // Se crea el token
    const token = jwt.sign({
        id: user._id
    },
        process.env.TOKEN_SECRET,
        { expiresIn: 60 * 60 * 24 * 30 }
    ); // Expira en 30 días

    res.json({ user: user, token });
}
async function updateProfile(req, res) {
    // Validamos que los datos cumplen con la estructura
    const { nombre, apellido, correo } = req.body;
    const { error } = schemaBasicData1.validate({ nombre, apellido, correo });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Obtenemos el usuario y comprobamos que sea el que esta realizando la petición
    const user = await User.findById(req.params.id);
    if (`${user._id}` !== req.params.id) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // Validamos que el email no se encuentra en nuestra base de datos
    if (user.correo !== correo && await User.findOne({ correo })) {
        return res.status(400).json({ error: 'El email ingresado ya se encuentra en nuestros registros' })
    }

    // Copiamos los parámetros al usuario y guardamos
    Object.assign(user, { nombre, apellido, correo, updated: Date.now() });
    await user.save();

    return res.json({ user });
}
async function updatePassword(req, res) {
    // Validamos que los datos cumplen con la estructura
    const { oldPassword, newPassword, repeatPassword } = req.body;
    const { error } = schemaUpdatePassword.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Obtenemos el usuario y comprobamos que sea el que esta realizando la petición
    const currentUser = await User.findById(req.params.id);
    if (`${currentUser._id}` !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const validPassword = await bcrypt.compare(oldPassword, currentUser.contraseña);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });
    if (newPassword !== repeatPassword) return res.status(400).json({ error: 'Las contraseñas no son identicas' });

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    // copy params to user and save
    currentUser.contraseña = password;
    currentUser.updated = Date.now();
    await currentUser.save();

    res.json({ user: currentUser });
}

async function updateAvatar(req, res) {
    try {
        if (!req.files) {
            res.status(400).send({ error: 'No se han cargado archivos' });
        } else {
            // Obtenemos el usuario y comprobamos que sea el que esta realizando la petición
            const currentUser = await User.findById(req.params.id);
            if (`${currentUser._id}` !== req.user.id) {
                return res.status(401).json({ error: 'Unauthorized' })
            }

            // Guardamos el archivo en la variable avatar
            const avatar = req.files.foto;

            // Eliminamos la imagen anterior (En caso de que no sea la por defecto)
            // A su vez validamos que exista la imagen
            if (currentUser.foto !== 'default.png' && fs.existsSync(currentUser.foto)) {
                fs.unlinkSync('src/public/avatar/' + currentUser.foto)
            }

            // Usamos el metodo mv() para mover el archivo al directorio pubic/avatar
            // Utilizamos el id único del usuario para evitar conflictos con los nombres al subir un archivo
            avatar.mv('src/public/avatar/' + currentUser._id + avatar.name);

            // Actualizamos el usuario y guardarmos
            currentUser.foto = `${fullURL(req)}/public/avatar/${currentUser._id}${avatar.name}`;
            currentUser.updated = Date.now();
            await currentUser.save();

            res.json({ user: currentUser });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
   
}
async function forgotPassword(req, res) {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        // Buscamos el usuario en la base de datos
        const user = await User.findOne({ correo: req.body.correo });
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

        // Creamos un token para resetear la contraseña que expira en 24 horas
        user.resetToken = {
            token: randomTokenString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        await user.save();

        // Enviar correo con la información
        await sendPasswordResetEmail(user, req.get('origin'));

        res.json({ message: 'Por favor, revisa tu correo electrónico para ver las instrucciones a seguir para restablecer la contraseña' });
    } catch (error) {
        res.status(400).json({ error });
    }
}
async function resetPassword(req, res) {
    try {
        const { token, password, confirmPassword } = req.body;
        const { error } = resetPasswordSchema.validate({ token, password, confirmPassword });
        if (error) return res.status(400).json({ error: error.details[0].message + 'aqui' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'Las contraseñas no son identicas' });

        // Buscamos el usuario en la base de datos
        // $gt - greater than - mayor que
        const currentUser = await User.findOne({
            'resetToken.token': token, // Buscamos el token
            'resetToken.expires': { $gt: Date.now() } // Comprobamos que la fecha de expiración del token es mayor que la fecha actual
        });
        if (!currentUser) return res.status(400).json({ error: 'Token inválido' });

        // Encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        // Actualizamos los parámetros y guardamos
        currentUser.contraseña = newPassword;
        currentUser.updated = Date.now();
        await currentUser.save();

        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(400).json({error: 'aqui'});
    }
}
async function verifyEmail(req, res) {
    const { token, password, confirmPassword } = req.body;
    const { error } = resetPasswordSchema.validate({ token, password, confirmPassword });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Token inválido' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Las contraseñas no son identicas' });

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash(password, salt);

    Object.assign(user, { isVerified: true, contraseña: userPassword, verificationToken: undefined });
    await user.save();

    res.json({ message: 'Verificación éxitosa, ahora puedes Iniciar Sesión' });
}
module.exports = {

    register,
    login,
    updateProfile,
    updatePassword,
    updateAvatar,
    forgotPassword,
    resetPassword,
    verifyEmail,

}