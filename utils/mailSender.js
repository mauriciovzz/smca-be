const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const config = require('../config/config');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
});

const accountVerification = async (accountData, origin, path) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'smca',
      link: origin,
    },
  });

  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${accountData.first_name} ${accountData.last_name}`,
      action: {
        instructions: `Haz clic en el botón para confirmar tu correo electrónico y 
                       finalizar el proceso de creación de tu cuenta.`,
        button: {
          color: '#0284C7',
          text: 'Verificar Cuenta',
          link: `${origin}${path}`,
        },
      },
      outro: `Este enlace de verificación expirará en ${config.VERIFICATION_TOKEN_LONG_EXPIRY}. 
              Si tu enlace ha expirado, inicia sesión en la aplicación con los datos registrados
              para solicitar uno nuevo.`,
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: `smca <${config.MAIL_USER}>`,
    to: accountData.email,
    subject: 'Verificación de cuenta.',
    html: emailBody,
    text: emailText,
  };

  const info = await transporter.sendMail(mailOptions);

  logger.info('"Account verification" email sent to:', info.envelope.to[0]);
  logger.divider();
};

const newEmailVerification = async (accountData, newEmail, origin, path) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'smca',
      link: origin,
    },
  });

  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${accountData.first_name} ${accountData.last_name}`,
      intro: 'Se recibió una solicitud para el cambio del correo electrónico de tu cuenta.',
      action: {
        instructions: 'Haz clic en el botón para confirmar el cambio:',
        button: {
          color: '#0284C7',
          text: 'Confirmar Cambio',
          link: `${origin}${path}`,
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
    subject: 'Confirmación de nuevo correo electrónico.',
    html: emailBody,
    text: emailText,
  };

  const info = await transporter.sendMail(mailOptions);

  logger.info('"Email verification" email sent to:', info.envelope.to[0]);
  logger.divider();
};

const passwordReset = async (accountData, origin, path) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'smca',
      link: origin,
    },
  });

  const emailInfo = {
    body: {
      greeting: 'Hola',
      name: `${accountData.first_name} ${accountData.last_name}`,
      intro: 'Recibiste este correo porque se recibió una solicitud de restablecimiento de contraseña para tu cuenta.',
      action: {
        instructions: 'Haga clic en el botón para restablecer su contraseña:',
        button: {
          color: '#0284C7',
          text: 'Restablecer Contraseña',
          link: `${origin}${path}`,
        },
      },
      outro: 'Si no solicitaste el restablecimiento de tu contraseña, no se requiere ninguna otra acción de tu parte.',
      signature: 'Atentamente',
    },
  };

  const emailBody = mailGenerator.generate(emailInfo);
  const emailText = mailGenerator.generatePlaintext(emailInfo);

  const mailOptions = {
    from: `smca <${config.MAIL_USER}>`,
    to: accountData.email,
    subject: 'Restablecimiento de contraseña.',
    html: emailBody,
    text: emailText,
  };

  const info = await transporter.sendMail(mailOptions);

  logger.info('"Password reset" email sent to:', info.envelope.to[0]);
  logger.divider();
};

module.exports = {
  accountVerification,
  newEmailVerification,
  passwordReset,
};
