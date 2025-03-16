const express = require('express');
const router = express.Router();
const cors = require ('cors');
const {test, signupUser, loginUser} = require('../controllers/authcontrollers.js')

//The middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',

    }
    )
)

router.get('/', test);
router.post('/signup', signupUser)
router.post('/Login', loginUser)
module.exports = router;