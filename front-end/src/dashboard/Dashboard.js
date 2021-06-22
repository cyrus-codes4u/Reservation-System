import React, { useEffect, useState } from "react";
import { listReservations, listTables }  from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { today, previous, next, formatAsTime } from "../utils/date-time";

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

  const listOfReservations = reservations ? reservations.map((reserve, index) => {
    return (
      <li key= {`id_${index}`} > 
        <p>Name: {reserve.last_name}, {reserve.first_name} </p>
        <p>Date: {reserve.reservation_date}</p>
        <p>Time: {formatAsTime(reserve.reservation_time)} </p>
        <p>Party of {reserve.people}</p>
      </li>
    )
  }) : null

  const listOfTables = tables ? tables.map((table,index) => {
    const available = table.reservation_id ? "Occupied" : "Free"
    return (
      <li key={`table_${index}`} data-table-id-status={table.table_id}> {table.table_name} : {available}</li>
    )
  }) : null

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <ErrorAlert error={reservationsError} />
        <ol>
          {listOfReservations}
        </ol>
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
        <ul>
          {listOfTables}
        </ul>
      </div>
    </main>
  );
}

export default Dashboard;
