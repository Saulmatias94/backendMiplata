const sendEmail = require('./send-email');

async function sendVerificationEmail(user, origin) {
    const verifyUrl = `${origin}/auth/verify-email?token=${user.verificationToken}`;
    const message = `
        <p>Hola ${user.nombre} ${user.nombre}</p>    
        <p>Haga clic en el enlace a continuación para verificar su dirección de correo electrónico:</p>
        <p><a href="${verifyUrl}">Verificar correo electrónico</a></p>`;

    await sendEmail({
        to: user.correo,
        subject: 'Verificar Email',
        html: `<h4>Verificar Email</h4>
               ${message}`
    });
}

async function sendPasswordResetEmail(user, origin) {
    const resetUrl = `${origin}/auth/reset-password?token=${user.resetToken.token}`;
    const message = `<p>Haga clic en el siguiente enlace para restablecer su contraseña, el enlace será válido durante 1 día:</p>
                   <p><a href="${resetUrl}">Restablecer contraseña</a></p>`;

    await sendEmail({
        to: user.correo,
        subject: 'Restablecer contraseña',
        html: `<h4>Restablecer contraseña</h4>
               ${message}`
    });
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}