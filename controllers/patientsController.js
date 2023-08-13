import PatientModel from '../models/PatientModel.js';

const addPatient = async (req, res) => {
    const patient = new PatientModel(req.body);
    patient.vet = req.vet._id;
    try {
        const patientSaved = await patient.save();
        res.json(patientSaved);
    } catch (error) {
        console.log(error);
    }
};

const getPatients = async (req, res) => {
    const patient = await PatientModel.find().where('vet').equals(req.vet);

    res.json(patient);
};

const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await PatientModel.findById(id);

    if (!patient) {
        return res.status(404).json({ message: 'No Encontrado' });
    }

    // console.log(patient.vet._id); //- Son evaluados como objetos diferentes asi son estos objetos
    // console.log(req.vet._id);
    /// Asegurarse que el paciente consultado fue agradado por el vet que esta investigando
    if(patient.vet._id.toString() !== req.vet._id.toString()){
        return res.json({ message: 'Acción no valida' });
    }

    res.json(patient);
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await PatientModel.findById(id);

    if (!patient) {
        res.status(404).json({ message: 'No Encontrado' });
    }
    
    if (patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({ message: 'Acción no valida' });
    }
    
    //! Actualizar paciente
    patient.name = req.body.name || patient.name; //- En caso de no mandar el nombre dejar el mismo
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        const patientUpdate = await patient.save();
        res.json(patientUpdate);
    } catch (error) {
        console.log(error);
    }
};

//! Eliminando un paciente
const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await PatientModel.findById(id);

    if (!patient) {
        return res.status(404).json({ message: 'No Encontrado' });
    }

    if (patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({ message: 'Acción no valida' });
    }

    try {
        await patient.deleteOne();
        res.json({ message : "Paciente Eliminado" });
    } catch (error) {
        console.log(error);
    }
};

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };
