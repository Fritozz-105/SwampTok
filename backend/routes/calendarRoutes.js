const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

//get event from user
router.get('/:firebaseUid', calendarController.getAllEvents);

// post new event
router.post('/', calendarController.saveEvent);

//delete the event
router.delete('/', calendarController.deleteEvent);

module.exports = router;