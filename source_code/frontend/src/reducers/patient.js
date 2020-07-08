import {
    UPDATE_SAMPLE_DATA,
    FETCH_PATIENT_DATA,
    FETCH_RECORD_DATA,
    EDIT_SINGLE_PATIENT,
    UPDATE_RECORD_LIST,
    FETCH_PATIENT_REPORT,
    FETCH_META_STATISTICS
} from '../actions/type';

const initialState = {
    proxyList: [],
    test_info: null,
    patientList: {},
    singlePatient: {},
    recordList: [],
    report: null,
    metaStatistics:null
};


export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SAMPLE_DATA:
            return {
                ...state,
                proxyList: action.payload
            };
        case FETCH_PATIENT_DATA:
            return {
                ...state,
                patientList:action.payload
            }
        case EDIT_SINGLE_PATIENT:
            console.log(action.payload)
            return {
                ...state,
                singlePatient: action.payload
            }
        case FETCH_RECORD_DATA:
            return {
                ...state,
                recordList:action.payload
            }
        case UPDATE_RECORD_LIST:
            return {
                ...state,
                recordList: state.recordList.concat(action.payload)
            }
        case FETCH_PATIENT_REPORT:
            return {
                ...state,
                report:action.payload
            }
        case FETCH_META_STATISTICS:
            return {
                ...state,
                metaStatistics: action.payload
            }
        default:
            return state
    }
}