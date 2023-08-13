import express from 'express';
const router = express.Router();
import {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} from '../controllers/patientsController.js';
import checkAuth from '../middleware/authMiddleware.js';

router.route('/').post(checkAuth, addPatient).get(checkAuth, getPatients);

//! 1) Ruta para eliminar un paciente .delete
router
    .route('/:id')
    .get(checkAuth, getPatient) 
    .put(checkAuth, updatePatient)
    .delete(checkAuth, deletePatient); /// Check what is authenticate

export default router;
