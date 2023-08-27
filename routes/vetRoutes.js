import express from 'express';
import {
    updatePassword,
    updateProfile,
    register,
    profile,
    confirm,
    authenticate,
    lostPassword,
    checkToken,
    newPassword,
} from '../controllers/vetController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

/// Área publica
router.post('/', register);
router.get('/confirm/:token', confirm);
router.post('/login', authenticate);

router.post('/lost-password', lostPassword);

//- Simplificar peticiones que comparten la misma ruta
router.route('/lost-password/:token').get(checkToken).post(newPassword);

/// Área privada
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
//! Creando la ruta para actualizar
router.put('/update-password', checkAuth, updatePassword);

export default router;
