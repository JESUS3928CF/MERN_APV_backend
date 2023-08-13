/// Importando el paquete de JWT
import jwt from "jsonwebtoken";

const generateJWT = (id) => {
    //! Creando el JWT
    return jwt.sign(
        { id }, //- Se le pasa un Objeto con la información que se va a agregar al JWT
        process.env.JWT_SECRET, //- La palabra secreta
        { //- Objeto para pasarle algunas opciones
            expiresIn: "30d", //. Tiempo de expiración del JWT puede ser 1d = un dia, 1h = una hora, 1m = un minuto 
        }
    ); 
}

export default generateJWT;