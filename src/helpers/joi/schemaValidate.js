const joi = require('joi');
const stringMessages = require('./messages');

const nombre = joi.string().min(2).max(255).required().messages(stringMessages("Los nombres", "os"));
const apellido = joi.string().min(2).max(255).required().messages(stringMessages("Los apellidos", "os"));
const correo = joi.string().min(6).max(255).required().email().messages(stringMessages("El correo electrónico"));
const contraseña = joi.string().min(6).max(1024).required().messages(stringMessages("La contraseña", "a"));
const educacion = joi.boolean().required().messages(stringMessages("La casilla", "a"));
const fecha = joi.string().required().messages(stringMessages("La fecha", "a"));

const schemaRegister = joi.object({ nombre, apellido, correo, contraseña, educacion, fecha});
const schemaLogin = joi.object({ correo, contraseña });
const schemaBasicData1 = joi.object({ nombre, apellido, correo});
const schemaBasicData = joi.object({ nombre, apellido, correo, fecha});
const forgotPasswordSchema = joi.object({ correo });

const schemaUpdatePassword = joi.object({
    oldPassword: joi.string().min(6).max(1024).required().messages(stringMessages("El campo contraseña actual")),
    newPassword: joi.string().min(6).max(1024).required().messages(stringMessages("El campo nueva contraseña")),
    repeatPassword: joi.string().min(6).max(1024).required().messages(stringMessages("El campo repetir contraseña")),
})
const resetPasswordSchema = joi.object({
    token: joi.string().required().messages(stringMessages("El token")),
    password: joi.string().min(6).max(1024).required().messages(stringMessages("El campo Contraseña")),
    confirmPassword: joi.string().min(6).max(1024).required().messages(stringMessages("El campo Repetir Contraseña")),
});

module.exports = {
    schemaRegister,
    schemaLogin,
    schemaBasicData,
    schemaUpdatePassword,
    forgotPasswordSchema,
    resetPasswordSchema,
    schemaBasicData1
}