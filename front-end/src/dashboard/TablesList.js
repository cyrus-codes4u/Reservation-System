import React from "react";

function TableList ({tables}) {
    if(!tables) {return null}
    const listOfTables = tables.map((table,index) => {
        const available = table.reservation_id ? "Occupied" : "Free"
        return (
          <li key={`table_${index}`} data-table-id-status={table.table_id}> {table.table_name} : {available}</li>
        )
    })

    return (
        <ul>
            {listOfTables}
        </ul>
    )
}

export default TableList