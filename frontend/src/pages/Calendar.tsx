import { useState } from "react";
import Sidebar from "../components/Sidebar";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date (for navigation)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // The selected date

  // Function to get the first day of the month
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)
  };

  // Function to get the number of days in the current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Function to go to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  // Function to go to the next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // Generate an array of the days in the current month
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Create an array of empty cells to account for the first day of the month
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null); // Empty cell
    }

    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  // Function to handle day click
  const handleDayClick = (day: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <main className="min-h-screen p-6">
          <h1 className="text-2xl font-bold">Calendar</h1>

          <div className="mt-6">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                {currentDate.getFullYear()}
              </h2>
              <button
                onClick={goToNextMonth}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Next
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4">
              {/* Weekday Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div key={index} className="text-center font-semibold">
                    {day}
                  </div>
                )
              )}

              {/* Days of the Month */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`text-center p-2 rounded-md cursor-pointer ${
                    day
                      ? selectedDate?.getDate() === day
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200"
                      : "bg-transparent"
                  }`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day || ""}
                </div>
              ))}
            </div>

            {/* Display Selected Date */}
            {selectedDate && (
              <div className="mt-4">
                <h3 className="text-lg">Selected Date:</h3>
                <p>{selectedDate.toDateString()}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;
