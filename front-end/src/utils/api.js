/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves reservation with matching id
 * @param id
 * the id of reservation to match.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function readReservation(id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${id}`);
  
  return await fetchJson(url, {method: "GET", headers, signal}, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

 export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a new reservation
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the newly created reservation.
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}

/**
 * Updates a reservation
 * @param reservation_id
 * the id of the reservation to be updated
 * @param updates
 * updated data for reservation in key-value format. 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the updated reservation.
 */
 export async function updateReservation(reservation_id, updates, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: updates }),
    headers,
    signal
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates the status of a reservation
 * @param reservation_id
 * the id of the reservation to be updated.
 * @param newStatus
 * updated status to which the status property of the reservation will be set. 
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the updated reservation.
 */
 export async function updateReservationStatus(reservation_id, newStatus, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: {status: newStatus } }),
    headers,
    signal
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of table saved in the database.
 */
 export async function listTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
}

/**
 * Creates a new table
 * @returns {Promise<[table]>}
 *  a promise that resolves to the newly created table.
 */
 export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, table);
}
/**
 * Seats a reservation at a table
 * @param reservation_id
 * the id of the reservation that is being seated
 * @param table_id
 * the id of the table at which they are being seated
 * @returns {Promise<[table]>}
 *  a promise that resolves to the table with updated reservation_id property.
 */
export async function seatReservation(reservation_id, table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id: reservation_id } }),
    headers,
    signal
  };
  return await fetchJson(url, options, {});
}
/**
 * Finishes a reservation at a table
 * @param table_id
 * the id of the table at which they are being seated
 * @returns {Promise<[table]>}
 *  a promise that resolves to the table with updated reservation_id property.
 */
 export async function finishReservation(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    signal
  };
  return await fetchJson(url, options, {});
}
