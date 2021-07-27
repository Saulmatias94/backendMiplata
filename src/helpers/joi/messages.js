const stringMessages = (parameterName, finalLetter = 'o') => {
    return {
        'string.empty': `${parameterName} no puede estar vací${finalLetter}`,
        'string.required': `${parameterName} es requerid${finalLetter} `,
        'string.min': `${parameterName} debe ser de un mínimo de {#limit} caracteres de largo `,
        'string.max': `${parameterName} debe ser de un máximo {#limit} caracteres de largo `,
        'string.email': `Ingrese un correo electrónico válido `,
        'string.educacion': `seleccione casilla`,
    }
}

module.exports = stringMessages;