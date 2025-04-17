import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../components/Layout';
import { saveEvent, getCalendarEvents, deleteEvent } from '../tools/api';
import useAuth from '../hooks/useAuth';

const CalendarPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ [key: string]: string }>({});
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const fetchEvents = async() =>{
      if (currentUser) {
        console.log('Fetching events for user:', currentUser.uid);
        setIsLoading(true);
        const response = await getCalendarEvents(currentUser.uid);
        console.log('Fetch response:', response);
        setIsLoading(false);
        if (response.success) {
          const eventsMap = response.events.reduce((acc: { [key: string]: string }, event: { date: string; eventName: string }) => {
            acc[event.date] = event.eventName;
            return acc;
          }, {});
          console.log('Events map:', eventsMap);
          setEvents(eventsMap);
        } else {
          setError(response.message || 'Failed to fetch events');
        }
      } else {
        console.log('No currentUser, clearing events');
        setEvents({});
      }
    };

    fetchEvents();
  },[currentUser]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setInputValue(events[date.toDateString()] || '');
    setSuccessMessage(null);
    setError(null);
  };
  const handleEventSave = async () => {
    if (selectedDate && currentUser) {
      setIsLoading(true);
      const response = await saveEvent({
        firebaseUid: currentUser.uid,
        date: selectedDate.toDateString(),
        event: inputValue,
      });
      setIsLoading(false);
      if (response.success) {
        setEvents((prev) => ({
          ...prev,
          [selectedDate.toDateString()]: inputValue,
        }));
        setSuccessMessage('Event saved successfully.');
        setError(null);
      } else {
        setError(response.message || 'Failed to save event.');
        setSuccessMessage(null);
      }
    }
  };
  const handleEventDelete = async (date: string) => {
    if (currentUser) {
      setIsLoading(true);
      const response = await deleteEvent(currentUser.uid, date);
      setIsLoading(false);
      if (response.success) {
        setEvents((prev) => {
          const newEvents = { ...prev };
          delete newEvents[date];
          return newEvents;
        });
        setSuccessMessage('Event deleted successfully.');
        setError(null);
      } else {
        setError(response.message|| 'Failed to delete event.');
        setSuccessMessage(null);


      }
    }
  };

  return (

    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Calendar</h1>

        {isLoading && <p>Loading...</p>}
        <Calendar onClickDay={handleDateChange} value={selectedDate} className="mb-6" />

        {selectedDate && (
          <div className="bg-white shadow-md rounded p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Add Event for {selectedDate.toDateString()}
            </h2>
            <input
              type="text"
              placeholder="Enter event name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              disabled={isLoading}
            />
            <button
              onClick={handleEventSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' :'Save Event'}
            </button>
            {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        )}

        {Object.keys(events).length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Saved Events</h3>
            <ul className="list-disc list-inside">
              {Object.entries(events).map(([date, event]) => (
                <li key={date} className="flex items-center justify-between">
                  <span>
                    <strong>{date}:</strong> {event}
                  </span>
                  <button
                    onClick={() => handleEventDelete(date)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No saved events.</p>
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;