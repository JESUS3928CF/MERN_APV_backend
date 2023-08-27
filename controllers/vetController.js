import VetModel from '../models/VetModel.js';
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import { emailRegister } from '../helpers/emailRegister.js';
import { emailLostPassword } from '../helpers/emailLostPassword.js';

const register = async (req, res) => {
    const { email, name } = req.body;
    const userExists = await VetModel.findOne({ email });

    console.log(email, name , ' esto envía si no existe');

    if (userExists) {
        const error = new Error('Usuario ya registrado');

        /// Cambia el estado a error
        return res.status(400).json({ message: error.message });
    }
    try {
        const vet = new VetModel(req.body);
        const vetSave = await vet.save();

        //! Aca 
        emailRegister({
            email,
            name,
            token: vetSave.token,
        });

        res.json(vetSave);
    } catch (error) {
        console.log(error + ' error al almacenar un registro');
    }
};

const profile = (req, res) => {
    const { vet } = req;
    res.json({ profile: vet });
};

const confirm = async (req, res) => {
    const { token } = req.params;

    const confirmUser = await VetModel.findOne({ token });

    if (!confirmUser) {
        const error = new Error('Token no valido');
        return res.status(404).json({ message: error.message });
    }

    try {
        confirmUser.token = null;
        confirmUser.confirm = true;
        await confirmUser.save();
        res.json({ message: 'Usuario Confirmado Correctamente' });
    } catch (error) {
        console.log(error);
    }
};

const authenticate = async (req, res) => {
    console.log('Recibimos una petición');
    const { email, password } = req.body;

    const user = await VetModel.findOne({ email });
    console.log(user);
    if (!user) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ message: error.message });
    }

    if (!user.confirm) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ message: error.message });
    }

    if (await user.checkPassword(password)) {
        //! en ves de retornar solo el token retornamos el usuario con la información que queremos retornar cuando se autentique
        res.json({
            /// Quitar la info no deseada y solo mostrar la necesaria
            profile: {
                //!- me toca ponerle profile por que allá en el from yo rectifico por el profile para mostrar las rutas
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateJWT(user.id),
            },
        });
        // res.json({token : generateJWT(user.id)}); //- asi estaba y nos accionaba el bug
    } else {
        const error = new Error('contraseña incorrecta');
        return res.status(403).json({ message: error.message });
    }
};

const lostPassword = async (req, res) => {
    const { email } = req.body;

    const existsVet = await VetModel.findOne({ email });

    if (!existsVet) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ message: error.message });
    }

    /// Try porque vamos a modificar un poco la DB
    try {
        existsVet.token = generateId();
        await existsVet.save();

        //! Enviar email con instrucciones
        emailLostPassword({
            email,
            name: existsVet.name,
            token: existsVet.token,
        });
        res.json({ message: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

const checkToken = async (req, res) => {
    const { token } = req.params;

    const validToken = await VetModel.findOne({ token });

    if (validToken) {
        /// El token es valido
        res.json({ message: 'Token válido el usuario existe' });
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({ message: error.message });
    }
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const vet = await VetModel.findOne({ token });

    if (!vet) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ message: error.message });
    }

    try {
        vet.token = null;
        vet.password = password;

        await vet.save();
        res.json({ message: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

//! Creando el end point para actualizar el profile
const updateProfile = async (req, res) => {
    const id = req.params.id;
    const vet = await VetModel.findById(id);

    if (!vet) {
        const error = new Error('Hubo un error no se encontró el perfil');
        return res.status(400).json({ message: error.message });
    }

    //! Evitar error el caso de que el correo actualizado no exista en otro perfil para que no falle el proyecto
    const { email } = req.body;
    if (vet.email !== req.body.email) {
        const existEmail = await VetModel.findOne({ email });
        if (existEmail) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({ message: error.message });
        }
    }

    try {
        /// Actualizamos el perfil
        vet.name = req.body.name || vet.name; //* si no esta presente el nombre se le asigna lo que ya esta en la DB
        vet.email = req.body.email || vet.email;
        vet.web = req.body.web; //* Estos se pueden eliminar
        vet.phone = req.body.phone;

        const vetUpdate = await vet.save();
        res.json(vetUpdate);
    } catch (error) {
        console.log(error);
    }
};

/// Creamos otra para actualizar el password por que esta es diferente dado a que se tiene el email
const updatePassword = async (req, res) => {
    /// 1) Leer los datos
    const { id } = req.vet;
    const { pwd_current, pwd_new } = req.body;

    /// 2) Comparar que el veterinario existe
    const vet = await VetModel.findById(id);
    if (!vet) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ message: error.message });
    }
    /// 3) Comprobar su password

    //- utilizamos el método del modelo para comparar las contraseñas hacheadas
    if (await vet.checkPassword(pwd_current)) {
        /// 4) Almacenar el nuevo password
        //- Esto se guarda Hasheado gracias al pre que creamos en el modelo
        vet.password = pwd_new;
        await vet.save();
        res.json({ message: 'Contraseña almacenada correctamente' });
    } else {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({ message: error.message });
    }
};

export {
    register,
    profile,
    confirm,
    authenticate,
    lostPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword, /// Exportando la función
};
