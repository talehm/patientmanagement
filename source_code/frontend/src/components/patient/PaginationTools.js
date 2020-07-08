import React, { useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from "react-redux"
import { loadPatients } from '../../actions/Actions'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

function PaginationTools(props) {
    //const [pageSize, setPageSize] = React.useState(10)
    var { page, pageSize } = props
    page=page === undefined ? 1 : page
    pageSize = pageSize === undefined ? 10 : pageSize
    //const [page, setPage] = React.useState(1)
  
    const handleChangePageSize = (e) => {
        //setPageSize(e.target.value)
        props.loadPatients(props.page,e.target.value, false, false)
    }
    const handleChangePage = (e) => {
        props.loadPatients(e.target.value, pageSize, false, false)

    }
    const handleArrowBtn = (page,firstPage, lastPage) => {
        console.log(props.page)
        props.loadPatients(page, pageSize, firstPage, lastPage)
    }
    useEffect(() => {
        props.loadPatients(page, pageSize, false, false)
    }, [page, pageSize,props]);
    return (
        
        <Paper variant="outlined" atyel={{backgroundColor:"gray"}}>
            <Grid container justify="center" alignItems="center">
                <Grid item xs={2}>
                    <Button variant="contained" color="primary" onClick={() => handleArrowBtn(1, true, false)} disabled={page<=1? true : false}>
                        <FirstPageIcon/>
                    </Button>{' '}
                    <Button variant="contained" color="primary" onClick={() => handleArrowBtn(page - 1, false, false)} disabled={page <= 1 ? true : false} >
                        <ArrowBackIosIcon/>
                    </Button>{' '}
                </Grid>
               
                <Grid item xs={3}>
                    <TextField
                        id="standard-number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={page}
                        onChange={handleChangePage}
                        style={{ width: 100, padding:"0 20px" }}
                        helperText="Page"


                    />
                    <TextField
                        id="standard-select-currency"
                        select
                        value={pageSize}
                        onChange={handleChangePageSize}
                        helperText="PageSize"
                        style={{ width: 100, }}
                    >
                        {[2,10, 20, 30, 40, 50].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={2} >
                    <Button variant="contained" color="primary" onClick={() => handleArrowBtn(page + 1, false, false)}>
                        <ArrowForwardIosIcon/>
                    </Button>{' '}
                    <Button variant="contained" color="primary" onClick={() => handleArrowBtn(page, false, true)}>  
                        <LastPageIcon/>
                    </Button>{' '}
                </Grid>
                </Grid>
            </Paper>
    );
}

const mapStateToProps = state => ({
    page: state.patient.patientList.page,
    pageSize: state.patient.patientList.pageSize
})

export default (connect(mapStateToProps, { loadPatients })(PaginationTools));