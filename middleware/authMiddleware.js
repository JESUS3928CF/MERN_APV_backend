//! Importando el paquete para poder comprobar el JWT
import jwt from "jsonwebtoken";
import VetModels from "../models/VetModel.js";

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        /// Try catch por que va a intentar descifrar ese token y si no cae en el catch directamente
            try {

                token = req.headers.authorization.split(" ")[1]; //* Para quitar el bearer y dejar solo el token
                // console.log(token);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);

                //! Creando una sección con la información del veterinario 
                req.vet  = await VetModels.findById(decoded.id).select("-password -token -confirm")
                // console.log(vet);
                return next();
            } catch (error) {
                const e = new Error('Token no Válido');
                return res.status(403).json({ message: e.message });
            }
        }
    
    if(!token){
        const error = new Error('Token no Válido o inexistente');
        res.status(403).json({ message: error.message });
    }
    next();
};

export default checkAuth;