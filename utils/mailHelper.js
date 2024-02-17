const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const config = require('./config');
const logger = require('./logger');

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'smca',
    link: config.BASE_URL,
  },
});

const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
});

const accountVerification = async (account, path) => {
  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${account.first_name} ${account.last_name}`,
      action: {
        instructions: 'Haz clic en el botón para confirmar tu correo electrónico y finalizar el proceso de creación de tu cuenta.',
        button: {
          color: '#DC4D2F',
          text: 'Verificar Cuenta',
          link: `${config.BASE_URL}${path}`,
        },
      },
      outro: 'Este enlace de verificación expirará en 1 hora. Si tu enlace ha expirado, inicia sesión en la aplicación con los datos registrados para solicitar uno nuevo.',
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: `smca <${config.MAIL_USER}>`,
    to: account.email,
    subject: 'Verificación de cuenta.',
    html: emailBody,
    text: emailText,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      logger.error(error.message);
    } else {
      logger.info('Email info: ', data);
    }
  });
};

const passwordReset = async (account, path) => {
  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${account.first_name} ${account.last_name}`,
      intro: 'Recibiste este correo electrónico porque se recibió una solicitud de restablecimiento de contraseña para tu cuenta.',
      action: {
        instructions: 'Haga clic en el botón para restablecer su contraseña:',
        button: {
          color: '#DC4D2F',
          text: 'Restablecer Contraseña',
          link: `${config.BASE_URL}${path}`,
        },
      },
      outro: 'Si no solicitó un restablecimiento de contraseña, no se requiere ninguna otra acción de su parte.',
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: `smca <${config.MAIL_USER}>`,
    to: account.email,
    subject: 'Restablecimiento de contraseña.',
    html: emailBody,
    text: emailText,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      logger.info(error.message);
    } else {
      logger.info('Email info: ', data);
    }
  });
};

const emailVerification = async (account, newEmail, path) => {
  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${account.first_name} ${account.last_name}`,
      intro: 'Se recibió una solicitud de cambio de correo electrónico de tu cuenta.',
      action: {
        instructions: 'Haga clic en el botón para confirmar el cambio:',
        button: {
          color: '#DC4D2F',
          text: 'Confirmar Cambio',
          link: `${config.BASE_URL}${path}`,
        },
      },
      outro: 'Este enlace expirara en 10 minutos. Si no solicitó un cambio de correo electrónico, no se requiere ninguna otra acción de su parte.',
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: `smca <${config.MAIL_USER}>`,
    to: newEmail,
    subject: 'Confirmación de correo electrónico.',
    html: emailBody,
    text: emailText,
  };

  transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      logger.info(error.message);
    } else {
      logger.info('Email info: ', data);
    }
  });
};

module.exports = {
  accountVerification,
  passwordReset,
  emailVerification,
};
