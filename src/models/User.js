const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    foto: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    rol: { type: String, required: true },
    contraseña: { type: String, minlength: 6 },
    educacion:{type: Boolean, default: false, required: true},
    fecha:{type: String, required: true},
    isVerified: { type: Boolean, default: true },
    verificationToken: String,
    resetToken: {
        token: String,
        expires: Date
    },
    created: { type: Date, default: Date.now },
    updated: Date
});

// Eliminanos la contraseña cuando obtenemos los datos de un usuario
userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.contraseña;
    return user;
}

module.exports = model('User', userSchema);
