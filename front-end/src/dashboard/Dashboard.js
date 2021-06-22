import React, { useEffect, useState } from "react";
import { listReservations, listTables }  from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import ReservationList from "./ReservationList";
import TableList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const queryParams = useQuery()
  const initialDate = queryParams.get("date") ? queryParams.get("date") : today()
  const [date, setDate] = useState(initialDate)
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController()
    setReservationsError(null)
    listReservations({ date }, abortController.signal)
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
        <h4 className="mb-0">Reservations for {date}</h4>
        <ErrorAlert error={reservationsError} />
        <ReservationList reservations={reservations} />
      </div>
      <button 
        type="button" 
        className="btn btn-secondary"
        onClick={() => setDate(previous(date))}
      >
        Previous Day
      </button>
      <button 
        type="button" 
        className="btn btn-primary"
        onClick={() => setDate(next(date))}
      >
        Next Day
      </button>
      <div className ="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
        <ErrorAlert error={tablesError} />
        <TableList tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
