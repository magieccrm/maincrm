import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const MyCalendar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;  
  const DBuUrl = process.env.REACT_APP_DB_URL;  
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const getCalanderData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get_calander_data`, {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
          }
        });
        setData(response?.data?.lead);
      } catch (error) {
        const message = await error?.response?.data?.message;
        if (message === 'Client must be connected before running operations' || message === 'Internal Server Error') {
          getCalanderData();
        } 
        console.log(error);
      }
    };

    getCalanderData();
  }, []);
    
  const aaaaa = data.map((leads) => ({
    title: (
      <React.Fragment>
        {leads.massage_of_calander} --Client <Link to={`/followupleads/${leads._id}`}>{leads.full_name}</Link>
      </React.Fragment>
    ),
    start: new Date(leads.followup_date), // Convert to Date object
    end: new Date(leads.followup_date) // Convert to Date object
  }));

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const customEventPropGetter = (event) => {
    return {
      className: 'custom-event',
    };
  };

  const AgendaTable = ({ events }) => (
    <table className="rbc-agenda-table">
      <thead>
        <tr>
          <th className="rbc-header">Date</th>
          <th className="rbc-header">Time</th>
          <th className="rbc-header">Comment</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index}>
            <td>{moment(event.start).format('YYYY-MM-DD')}</td>
            <td>{moment(event.start).format('HH:mm')}</td>
            <td>{event.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={aaaaa}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'agenda']}
        style={{ height: 400 }}
        components={{ agenda: { table: AgendaTable } }}
        eventPropGetter={customEventPropGetter}
        onSelectEvent={handleEventSelect}
      />
      {/* Your modal component here */}
    </div>
  );
};

export default MyCalendar;
