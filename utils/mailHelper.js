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

const resetPassword = async (account, path) => {
  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${account.first_name} ${account.last_name}`,
      intro: 'Recibiste este correo electrónico porque se recibió una solicitud de restablecimiento de contraseña para tu cuenta.',
      action: {
        instructions: 'Haga clic en el botón para restablecer su contraseña:',
        button: {
          color: '#DC4D2F',
          text: 'Restablecer contraseña',
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
    from: config.MAIL_USER,
    to: account.email,
    subject: 'Restablecer contraseña',
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

const updateEmail = async (account, newEmail, path) => {
  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${account.first_name} ${account.last_name}`,
      intro: 'Se recibió una solicitud de cambio de correo electrónico de tu cuenta.',
      action: {
        instructions: 'Haga clic en el botón para confirmar el cambio:',
        button: {
          color: '#DC4D2F',
          text: 'Cambiar correo electrónico',
          link: `${config.BASE_URL}${path}`,
        },
      },
      outro: 'Si no solicitó un cambio de correo electrónico, no se requiere ninguna otra acción de su parte.',
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: config.MAIL_USER,
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
  resetPassword,
  updateEmail,
};
