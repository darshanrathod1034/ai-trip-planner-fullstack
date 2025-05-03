import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TripDateSelector = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="">
      <h2 className="block font-semibold">Select Your Trip Dates</h2>

      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className="border p-2 rounded w-full mb-2"
      />

      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="End Date"
        className="ml-2 border p-2 rounded w-full"
      />
    </div>
  );
};

export default TripDateSelector;
