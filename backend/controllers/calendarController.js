const Calendar = require('../models/Event');

// Controller to get all events for a user
exports.getAllEvents = async (req, res) => {
    const { firebaseUid}=req.params;

    try {
        const events=await Calendar.find({ firebaseUid});

        if (!events) {
            return res.status(404).json({ success: false, message: 'No events found' });
        }

        res.status(200).json({ success: true, events });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events', error });
    }
};

exports.saveEvent = async (req, res) => {
    const { firebaseUid, date, eventName }=req.body;

    try {
        // Check if an event already exists for that date
        let existingEvent = await Calendar.findOne({firebaseUid, date });

        if (existingEvent) {
            // If event exists, update it
            //right now only will do one event per day-> for future can make so that calendar is more functional
            existingEvent.eventName = eventName;
            await existingEvent.save();
            return res.status(200).json({ success:true, message:'Event updated successfully' });
        } else {

            // Otherwise, create a new event
            const newEvent = new Calendar({firebaseUid, date, eventName });
            await newEvent.save();
            res.status(201).json({ success: true, message:'Event saved successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false,message:'Error saving event', error });
    }
};


// Controller to delete an event
exports.deleteEvent = async (req, res) => {
    const { firebaseUid, date } = req.body;
  
    try {
      if (!firebaseUid || !date) {
        return res.status(400).json({ success: false, message:'firebaseUid and date are required' });
      }
  
      const event = await Calendar.findOneAndDelete({ firebaseUid, date });
  
      if (!event) {
        return res.status(404).json({ success: false, message:'Event not found' });
      }
  
      res.status(200).json({ success: true, message:'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
    }
  };