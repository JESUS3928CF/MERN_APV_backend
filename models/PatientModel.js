import mongoose from "mongoose";


//! Definiendo es esquema
const PatientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: true,
        default: Date.now()
    },
    symptoms: {
        type: String,
        require: true,
    },
    vet: {
        type: mongoose.Schema.Types.ObjectId, /// Para seleccionar un id de llave foránea 
        ref: "VetModel"  /// Para traer la información del veterinario de este paciente usar el nombre del modelo 
    }
},
{
    timestamps: true,
});

const PatientModel = mongoose.model('Patient', PatientSchema);

export default PatientModel;