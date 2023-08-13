import nodemailer from 'nodemailer';
export const emailRegister = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    });

    console.log(data);
    const { email, name , token } = data;

    //! Enviar el email

    /// Utilizando un método del transporter para enviar un email
    const info = await transporter.sendMail({
        /// recibe un objeto con el contenido del email
        from: 'APV - Administrador de Pacientes de Veterinaria', //* Quien envía
        to: email, //* A quien se le envía
        subject: 'Comprueba tu cuenta en APV', //* Objetivo del email
        text: 'Comprueba tu cuenta en APV', //* Una versión sin html del objetivo
        html: `<p>Hola ${name}, comprueba tu cuenta en APV.</p>
         <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
         <a href="${process.env.FRONTEND_URL}/confirm-account/:${token}">Comprobar Cuenta</a></p>
         <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje<p>
        `,
    });
    //! El usuario no hay que mandarlo  a interactuar con la API si no que se manda al frontend Y REACT es el que hace la conexión con la API

    console.log("Mensaje enviado: %s", info.messageId);
} 