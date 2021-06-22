import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { listReservations, listTables }  from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next } from "../utils/date-time";
import ReservationList from "./ReservationList";
import TableList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({currentDate}) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadReservations, [currentDate]);

  function loadReservations() {
    const abortController = new AbortController()
    setReservationsError(null)
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError)
    return () => abortController.abort()
  }

  useEffect(loadTables, [])

  function loadTables(){
    const abortController = new AbortController()
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort()
  }
  
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
        <ErrorAlert error={reservationsError} />
        <ReservationList reservations={reservations} />
      </div>
      <Link to={`/dashboard?date=${previous(currentDate)}`} className="btn btn-secondary">Previous Day</Link>
      <Link to={`/dashboard?date=${next(currentDate)}`} className="btn btn-primary">Next Day</Link>
      <div className ="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
        <ErrorAlert error={tablesError} />
        <TableList tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
