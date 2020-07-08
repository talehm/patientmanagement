import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import FormValidation from './FormValidation'
import RemoveIcon from '@material-ui/icons/HighlightOff'
import { blue } from '@material-ui/core/colors';
import { connect } from "react-redux"
import 'react-day-picker/lib/style.css';
import InputAdornment from '@material-ui/core/InputAdornment';
import EuroIcon from '@material-ui/icons/Euro';
import TextField from '@material-ui/core/TextField';
import { addNewPatient, updatePatient, removeMetaData, addNewRecord, updateRecordList } from '../../actions/Actions'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AutoSuggest from '../shared/AutoSuggest'
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});


function useMergeState(initialState) {
    const [state, setState] = React.useState(initialState);
    const setMergedState = newState =>
        setState(prevState => Object.assign({}, prevState, newState)
        );
    return [state, setMergedState];
}

function SimpleDialog(props) {
    const classes = useStyles();

    const { onClose, open, type, singlePatient } = props;
    const [newRecordPatient, setNewRecordPatient] = React.useState(null);

    var [patientData, setPatientData] = useMergeState({
        name: '',
        officialId: '',
        dateOfBirth: null,
        email: '',
        metaData: []
    });
    const [recordData, setRecordData] = useMergeState({
        patientId: '',
        disease: '',
        createdAt: new Date(),
        bill: '',
        description: ''
    });



    const handlePatientData = (select, value) => {
        setPatientData({ [select]: value })
    }
    const handlePatientMetaData = (select, index, event) => {
        let newMetaData = patientData.metaData
        newMetaData[index] = { ...newMetaData[index], [select]: event.target.value }
        setPatientData({ metaData: newMetaData })
    }
    const handleRecordData = (select, value) => {
        setRecordData({ [select]: value })

    }
    const getPatientId = (patient) => {
        setNewRecordPatient(patient)
        setRecordData({ patientId: patient.id })
    }


    const handleDateOfBirth = (value) => {
        setPatientData({ dateOfBirth: value })
    }

    const handleEntryDate = (value) => {
        setRecordData({ createdAt: value })
    }
    const handleSuccessfullResponse = () => {
        const newRecord = {
            name: newRecordPatient.name,
            disease: recordData.disease,
            createdAt: Intl.DateTimeFormat("en-US", {
                year: "numeric",
                day: "2-digit",
                month: "long"

            }).format(recordData.createdAt)



        }
        props.updateRecordList(newRecord)
    }
    const submitNewRecord = () => {
        props.addNewRecord(recordData, handleSuccessfullResponse)
        onClose()
    }
    const submitNewPatient = () => {
        props.addNewPatient(patientData)
        onClose()
    }
    const updatePatient = () => {
        props.updatePatient(singlePatient.id, patientData)
        onClose()

    }
    const addNewMetaData = () => {
        setPatientData({
            metaData: [...patientData.metaData, { key: '', value: '' }]
        })
    }
    const removeMetaData = (index) => {
        if (patientData.metaData[index].id) {
            props.removeMetaData(patientData.metaData[index].id)
        }
        patientData.metaData.splice(index, 1)
        setPatientData({ metaData: patientData.metaData })
    }
    useEffect(() => {
        const { mode, singlePatient } = props
        console.log(singlePatient)
        if (mode === 'update' && Object.keys(singlePatient).length>0) {
            setPatientData({
                name: singlePatient.name,
                officialId: singlePatient.officialId,
                dateOfBirth: singlePatient.dateOfBirth,
                email: singlePatient.email,
                metaData: singlePatient.metaData
            })
        }
        // Update the document title using the browser API
    }, [singlePatient]);
    console.log(patientData)
    const keyValuePair = patientData.metaData.length > 0 ? patientData.metaData.map((data, index) =>
        <ListItem button >
            <TextField id="outlined-basic" value={patientData.metaData[index].key} onChange={event => handlePatientMetaData('key', index, event)} fullWidth label="Key" variant="outlined" />
            <TextField id="outlined-basic" value={patientData.metaData[index].value} onChange={event => handlePatientMetaData('value', index, event)} fullWidth label="Value" variant="outlined" />
            <Button onClick={() => removeMetaData(index)}><RemoveIcon /></Button>
        </ListItem>
    )
        :
        null
    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} >
            <DialogTitle id="simple-dialog-title">Add New {type}</DialogTitle>
            <>
                {props.type === "patient" ?
                    <List style={{ width: 400 }}>
                        <ListItem button >
                            <TextField id="outlined-basic" value={patientData.name} onChange={e => handlePatientData('name', e.target.value)} fullWidth label="Patient Name" />
                            <FormValidation data={{ value: patientData.name, type: 'text' }} />
                        </ListItem>
                        <ListItem button >
                            <TextField id="outlined-basic" value={patientData.officialId} onChange={e => handlePatientData('officialId', parseInt(e.target.value))} fullWidth label="Official Id" />
                            <FormValidation data={{ value: patientData.officialId, type: 'numeric' }} />
                        </ListItem>
                        <ListItem button >
                            <MuiPickersUtilsProvider className="muiUtils" utils={DateFnsUtils}>
                                <DatePicker
                                    fullWidth
                                    autoOk
                                    disableFuture
                                    openTo="year"
                                    format="dd/MM/yyyy"
                                    label="Date of birth"
                                    views={["year", "month", "date"]}
                                    value={patientData.dateOfBirth}
                                    onChange={handleDateOfBirth}
                                />
                            </MuiPickersUtilsProvider>
                        </ListItem>
                        <ListItem button>
                            <TextField id="outlined-basic" value={patientData.email} onChange={e => handlePatientData('email', e.target.value)} fullWidth label="Email Address" />
                            <FormValidation data={{ value: patientData.email, type: 'email' }} />
                        </ListItem>
                        {keyValuePair}

                        <ListItem button style={{ marginTop: 10 }}>
                            <Grid container justify="center">
                                <Grid item>
                                    <Button
                                        onClick={addNewMetaData}
                                        variant="contained"
                                        color="default"
                                        
                                        startIcon={<AddIcon />}
                                        size="small"
                                    >
                                        Add New Meta Data
                            </Button>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem button style={{ marginTop: 10 }}>
                            <Grid container justify="center">
                                <Grid item>
                                    {props.mode === 'create' ? <Button size="small" color="primary" variant="contained" onClick={submitNewPatient}> Submit</Button>
                                        : <Button size="small" color="primary" variant="contained" onClick={updatePatient}> Update</Button>}
                                </Grid></Grid>
                        </ListItem>
                    </List>
                    :
                    <List style={{ width: 400 }}>
                        <ListItem button>
                            <AutoSuggest getPatientId={(patient) => getPatientId(patient)} />
                        </ListItem>

                        <ListItem button >
                            <TextField margin="dense" id="outlined-basic" value={recordData.disease} onChange={e => handleRecordData('disease', e.target.value)} fullWidth label="Disease Name" />
                            <FormValidation data={{ value: recordData.disease, type: 'alphanumeric' }} />
                        </ListItem>
                        <ListItem button>
                            <MuiPickersUtilsProvider className="muiUtils" utils={DateFnsUtils}>
                                <DatePicker
                                    fullWidth
                                    autoOk
                                    disableFuture
                                    openTo="year"
                                    format="dd/MM/yyyy"
                                    label="Time of Entry"
                                    views={["year", "month", "date"]}
                                    value={recordData.createdAt}
                                    onChange={handleEntryDate}
                                />
                            </MuiPickersUtilsProvider>
                        </ListItem>

                        <ListItem button >
                            <TextField
                                margin="dense"
                                value={recordData.bill}
                                onChange={e => handleRecordData('bill', parseInt(e.target.value))}
                                
                                id="input-with-icon-textfield"
                                label="Bill"
                                fullWidth

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EuroIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormValidation data={{ value: recordData.bill, type: 'numeric' }} />

                        </ListItem>
                        <ListItem button >
                            <TextField
                                margin="dense"
                                value={recordData.description}
                                onChange={e => handleRecordData('description', e.target.value)}
                                fullWidth
                                id="outlined-multiline-static"
                                label="Description"
                                multiline
                                rows={4}

                            />

                        </ListItem>

                        <ListItem button style={{ marginTop: 10 }}>
                            <Grid container justify="center">
                                <Grid item>
                                    <Button size="small" color="primary" variant="contained" onClick={submitNewRecord}> Submit</Button>
                                </Grid></Grid>
                        </ListItem>
                    </List>
                }

            </>

        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function SimpleDialogDemo(props) {
    return (
        <div>
            <SimpleDialog data={props.data} open={props.open} type={props.type} onClose={props.onClose} {...props} />
        </div>
    );

}
const mapStateToProps = state => ({
    singlePatient: state.patient.singlePatient
})

export default (connect(mapStateToProps, { addNewPatient, updatePatient, removeMetaData, updateRecordList, addNewRecord })(SimpleDialogDemo));