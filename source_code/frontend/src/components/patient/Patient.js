import React, { Component } from 'react';
import Table from "../shared/Table"
import AddNewForm from "../shared/AddNewForm"
import { loadPatients, getPatient } from '../../actions/Actions'
import PaginationTools from './PaginationTools'
import { connect } from "react-redux"
import Button from '@material-ui/core/Button'
import PlusIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid'
import Loader from 'react-loader-spinner'
import Dashboard from '../dashboard/Dashboard';

class Patient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }
    getReport = (id) => {
        this.props.history.push("/report/" + id)
    }
    addNew = (type) => {
        this.setState({ open: true })
        this.setState({ mode: 'create' })
    }

    handleClose = () => {
        this.setState({ open: false })
        this.setState({ mode: null })
    }
    handleGetPatientResponse = () => {
       
    }
    handleGetPatient = (id) => {

        
        this.props.getPatient(id)
        this.setState({ open: true })
        this.setState({ mode: 'update' })
        
    }

    render() {
        const { open, mode } = this.state
        const { patientlist } = this.props

        var tableCols = [{ title: 'ID', field: 'id', width: 50 },
        { title: 'Name', field: 'name' },
        { title: 'Date Of Birth', field: 'dateOfBirth' },
        { title: 'Last Entry', field: 'lastEntry' },
        { title: 'Meta Data Count', field: 'metaDataCount' }]
        return (
            <Dashboard>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <AddNewForm open={open} onClose={this.handleClose} type="patient" mode={mode} />
                        {/*<ReactTable data={patientList} cols={cols} />*/
                        }
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PlusIcon />}
                            onClick={() => this.addNew("patient")}
                            size="small"
                            style={{ position: 'absolute', right: 0, top: 75 }}
                        >
                            New Patient
                        </Button>
                        <PaginationTools />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        {Object.keys(patientlist).length > 0
                        ? <Table cols={tableCols} data={patientlist.result} actions={true} getReport={(id) => this.getReport(id)} handlegetpatient={(id) => this.handleGetPatient(id)} />
                            : <Loader
                                style={{ marginTop: 50 }}
                                type="Bars"
                                color="#00BFFF"
                                height={50}
                                width={50}
                                timeout={0} //3 secs

                            />}
                    </Grid>
                </Grid>
                </Dashboard>
            )


    }
}

const mapStateToProps = state => ({
    patientlist: state.patient.patientList
})


export default (connect(mapStateToProps, { loadPatients, getPatient })(Patient));