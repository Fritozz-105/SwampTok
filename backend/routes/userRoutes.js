const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/sync', userController.syncUser);
router.get('/:firebaseUid', userController.getUserByFirebaseUid);

module.exports = router;
