
import {
    FETCH_PATIENT_DATA,
    EDIT_SINGLE_PATIENT,
    UPDATE_RECORD_LIST,
    FETCH_RECORD_DATA,
    FETCH_PATIENT_REPORT,
    FETCH_META_STATISTICS
} from "./type"
import AuthStore from '../components/auth/AuthStore'

export const loadPatients = (page, pageSize, firstPage, lastPage) => dispatch => {
    fetch('/api/Patients?page=' + page + '&pageSize=' + pageSize + '&firstPage=' + firstPage + '&lastPage=' + lastPage, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()

        }

    })
        .then(res => res.json())
        .then(res => {
            dispatch({
                type: FETCH_PATIENT_DATA,
                payload: res
            })
        }
        )
}
export const loadRecords = () => dispatch => {
    fetch('/api/Records/' , {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }
    })
        .then(res => res.json())
        .then(res => {
            dispatch({
                type: FETCH_RECORD_DATA,
                payload: res.result
            })
        })
}

export const addNewPatient = (data)=>dispatch => {
    //console.log("worked")
    fetch('/api/Patients', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        },
        body: JSON.stringify(data)

    })
        .then(res => res.json())
        .then(res => {
            dispatch({
                type: FETCH_PATIENT_DATA,
                payload: res
            })

        }
        )
}

export const getPatient = (id) => dispatch => {
    fetch('/api/Patients/' + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }

    })
        .then(res => res.json())
        .then(res => 
            dispatch({
                type: EDIT_SINGLE_PATIENT,
                payload: res.result[0]
            })
        )
}

export const updatePatient = (id, data) => dispatch => {
    fetch('/api/Patients/'+id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        },
        body: JSON.stringify(data)

    })
        .then(res => res.json())
        .then(res => {
           

        }
        )
}

export const removeMetaData = (id) =>dispatch=> {
    fetch('/api/MetaDatas/' + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
}



export const fetchPatientNames = (text, handleResponse) => dispatch => {
    console.log(text)
    fetch('/api/Patients/name/' + text, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            handleResponse(res.result)
            //console.log(res)
        })
}

export const addNewRecord = (data, handleSuccessfullResponse) => dispatch => {
    fetch('/api/Records', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        },
        body: JSON.stringify(data)

    })
        .then(res => {
            if (res.status === 200) {
                handleSuccessfullResponse()

            }
        }
        )
}

export const updateRecordList = (newRecord) =>dispatch=> {
    dispatch({
        type: UPDATE_RECORD_LIST,
        payload: newRecord
    })
}

export const getReport = (id) => dispatch => {
    console.log(AuthStore.getBearer())
    fetch('/api/Patients/report/'+id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            dispatch({
                type: FETCH_PATIENT_REPORT,
                payload: res.result[0]
            })
        })

}

export const getMetaStatistics = () => dispatch => {
    fetch('api/MetaDatas/statistics/', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AuthStore.getBearer()
        }
    })
        .then(res => res.json())
        .then(res => dispatch({
            type: FETCH_META_STATISTICS,
            payload: res
        }))
}

export const signIn = (data, handleErrorResponse, handleSuccessfullResponse) => dispatch => {
    fetch('api/Login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {

            const status = response.status;

            if (status === 200) {

                return response.json()
            } else {
                throw response;
            }
           
        })
        .then(res => {
            AuthStore.saveToken(res.token)
            handleSuccessfullResponse()
            return res
        })
        .catch(err => {
            try {
                /* If status code is 401 then send message to client that provided data is wrong*/
                if (err.status === 400) {
                    handleErrorResponse("Please try again. Credentials are wrong.")
                    
                }
            }
            catch (err) {
            /* When network error occurs, inform the client */
                handleErrorResponse("Netzwerkfehler ist aufgetreten. Bitte überprüfen Ihren Server.")
               
            }
        });
}