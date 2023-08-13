import mongoose from "mongoose";

//! Importando el encriptador
import bcrypt from "bcrypt";
import generateId from "../helpers/generateId.js";

const vetSchema = mongoose.Schema(
    { /// OBJETO PARA DECLARAR LA ESTRUCTURA DE LOS DATOS
        name: {
            type: String,
            required: true,
            trim: true
        },
        password:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        phone: {
            type: String,
            default: null,
            trim: true
        },
        web:{
            type: String,
            default: null
        },
        token:{
            type: String,
            /// El nuevo cambio
            default: generateId()
        },
        confirm: {
            type: Boolean,
            default: false
        }
    }
);

vetSchema.pre("save", async function(next) {
    console.log(this); //* Imprimiendo el registro antes de guardar


    /// Saltar al siguiente middleware si es modificado el usuario dado a que ya no es necesario Hashear de nuevo
    if(!this.isModified("password")){
        next();
    }

    //! Generar el salt son las rondas de Hacheo 
    const salt = await bcrypt.genSalt(10); //* Entre más le pongas más recursos del servidor usa

    this.password = await bcrypt.hash(this.password, salt);
});

//! Desde el modelo comparar la contraseña ingresada vs la almacenada 
vetSchema.methods.checkPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const VetModel = mongoose.model("Vet",vetSchema);

export default VetModel;