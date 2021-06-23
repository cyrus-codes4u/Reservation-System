import React from "react";

function TableList ({tables, finish}) {
    if(!tables) {return null}
    const listOfTables = tables.map((table,index) => {
        const finishButton = !table.reservation_id ? null : (<button 
            type="button" 
            className="btn btn-primary" 
            data-table-id-finish={table.table_id} 
            onClick={() => finish(table.table_id)}
        >
            Finish
        </button>)
        
        return (
          <li key={`table_${index}`} data-table-id-status={table.table_id}> 
            {table.table_name} : {table.reservation_id ? "Occupied" : "Free"}
            {finishButton}     
          </li>
        )
    })

    return (
        <ul>
            {listOfTables}
        </ul>
    )
}

export default TableList