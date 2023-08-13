import nodemailer from 'nodemailer';
export const emailLostPassword = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    });

    console.log(data);
    const { email, name, token } = data;

    //! Enviar el email
    /// Utilizando un método del transporter para enviar un email
    const info = await transporter.sendMail({
        /// recibe un objeto con el contenido del email
        from: 'APV - Administrador de Pacientes de Veterinaria', //* Quien envía
        to: email, //* A quien se le envía
        subject: 'Restablece tu Contraseña', //* Objetivo del email
        text: 'Restablece tu Contraseña', //* Una versión sin html del objetivo
        html: `<p>Hola ${name}, has solicitado restablecer tu contraseña.</p>
         <p>Sigue el siguiente enlace para generar una una contraseña: 
         <a href="${process.env.FRONTEND_URL}/lost-password/:${token}">Restablecer contraseña</a></p>
         <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje<p>
        `,
    });
    console.log('Mensaje enviado: %s', info.messageId);
};
