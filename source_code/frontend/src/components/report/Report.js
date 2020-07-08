import React, { useEffect, Fragment } from 'react';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { getReport } from '../../actions/Actions'
import { connect } from "react-redux"
import Grid from '@material-ui/core/Grid';
import Dashboard from '../dashboard/Dashboard';
import Loader from 'react-loader-spinner'

import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


function useMergeState(initialState) {
    const [state, setState] = React.useState(initialState);
    const setMergedState = newState =>
        setState(prevState => Object.assign({}, prevState, newState)
        );
    return [state, setMergedState];
}

function Report(props) {
    const {report}=props
    useEffect(() => {
        const id = props.match.params.id
        console.log(id)
        props.getReport(id)
    }, [props.match.params.id]);

    var [open, setOpen] = useMergeState({
        patients: false,
        fifthRecord: false,
       
    });
    const handleClick = (key) => {
        setOpen({
            [key]:!open[key],
        });
    };
    const classes = useStyles();
        
    if (report != null) {
        return (
            <Dashboard>
            <Grid container justify="center" alignItems="center" style={{ height:"100%" }}>
                <Grid item lg={6}>
                    <Paper elevation={3}>
                        <List className={classes.root}>
                            {Object.entries(report).map(([key, value]) =>
                                typeof (value) != 'object' || value === null ?
                                    <ListItem key={key} role={undefined} dense button >
                                        <ListItemText primary={<Typography variant="h5" component="h4" style={{ textTransform: 'capitalize' }} >{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Typography>} />
                                        <ListItemSecondaryAction >{<Typography variant="h5" component="h4" style={{ textTransform: 'capitalize' }} >{value}</Typography>}</ListItemSecondaryAction>
                                    </ListItem>
                                    :
                                    <Fragment key={key}>
                                    <ListItem onClick={() => handleClick(key)} dense  button>
                                            <ListItemText primary={<Typography variant="h5" component="h4" style={{ textTransform: 'capitalize' }} >{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Typography>} />
                                        <ListItemSecondaryAction >{
                                            open[key] ? <ExpandLess  /> : <ExpandMore  />
                                        }</ListItemSecondaryAction>
                                    </ListItem>
                                        <Collapse in={open[key]} timeout="auto" unmountOnExit>
                                            <Grid container justify="center" style={{backgroundColor:"#f2f2f2"}} >
                                                <Grid item lg={8}>
                                                    {Array.isArray(value) ?
                                                        <List component="div" disablePadding
                                                            subheader={
                                                                <ListSubheader component="div" id="nested-list-subheader">
                                                                   Patient List with Similar Diseases
                                                                </ListSubheader>
                                                            }
                                                        >
                                                            {value.map((value, i) => (
                                                                <ListItem button key={i} className={classes.nested} onClick={() => props.history.push("/report/" + value.id)}>
                                                                    <ListItemText primary={value.name} />
                                                                </ListItem>
                                                            ))}
                                                            </List>
                                                        :
                                                        <Table className={classes.table} aria-label="simple table">
                                                            <TableBody>
                                                                {Object.entries(value).map(([key, value]) => (
                                                                    <TableRow key={key}>
                                                                        <TableCell component="th" >
                                                                            <Typography variant="h6" gutterBottom style={{ textTransform: 'capitalize' }}   >{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            <Typography variant="subtitle1" >{value}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    }   
                                                
                                                    </Grid></Grid>
                                        </Collapse>
                            </Fragment>
                            )}
                        </List>
                    </Paper>
                    </Grid>
                </Grid>
            </Dashboard>
            
        )
    }
    else {
        return (<Dashboard><Loader
            style={{ marginTop: 50 }}
            type="Bars"
            color="#00BFFF"
            height={50}
            width={50}
            timeout={0} //3 secs

        /></Dashboard>)
    }
    
}


const mapStateToProps = state => ({
    report: state.patient.report
})


export default (connect(mapStateToProps, { getReport })(Report));
