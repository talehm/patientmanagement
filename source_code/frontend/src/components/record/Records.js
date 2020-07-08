import React, { useEffect } from 'react';
import Table from "../shared/Table"
import AddNewForm from "../shared/AddNewForm"
import { loadRecords } from '../../actions/Actions'
import Button from '@material-ui/core/Button'
import PlusIcon from '@material-ui/icons/Add';
import { connect } from "react-redux"
import Dashboard from '../dashboard/Dashboard';


function Records(props) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const addNew = (type) => {
        setOpen(true)
    }      
    useEffect(() => {  
        props.loadRecords();
    }, []);
    const tableCols = [
        { title: 'Patient Name', field: 'name' },
        { title: 'Disease', field: 'disease' },
        { title: 'Entry Date', field: 'createdAt' },
    ];
    return (
        <Dashboard>
            <AddNewForm open={open} onClose={handleClose} type="record" />
            <Button
                variant="contained"
                color="secondary"
                startIcon={<PlusIcon />}
                onClick={() => addNew("record")}
                size="small"
            >
                New Record
                     </Button>
            <Table cols={tableCols} data={props.recordList} actions={false}  />
        </Dashboard>
        )
    
}

const mapStateToProps = state => ({
    recordList: state.patient.recordList
})

export default (connect(mapStateToProps, { loadRecords })(Records));