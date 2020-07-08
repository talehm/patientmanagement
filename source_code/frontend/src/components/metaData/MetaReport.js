import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { getMetaStatistics } from '../../actions/Actions'
import Grid from '@material-ui/core/Grid';
import { connect } from "react-redux"
import Loader from 'react-loader-spinner'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Title from '../dashboard/Title';
import Dashboard from '../dashboard/Dashboard';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

 function MetaStatistics(props)  {
    const classes = useStyles();
    const { metaStatistics} = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    useEffect(() => {
        props.getMetaStatistics()
    }, []);
     if (metaStatistics != null) {
         return (
             <Dashboard>
             <Grid container justify="center">

                 
                 {Object.entries(metaStatistics).map(([key, value]) =>
                     typeof (value) != 'object' || value === null ?
            
                         <Grid item xs={12} md={4} lg={4} key={key}>
                              <Paper className={fixedHeightPaper}>
                                 <Title >{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Title>
                                 <Typography component="p" variant="h4">
                                        {value}
                                 </Typography>
                              </Paper>
                         </Grid>
                                     :
                         <Grid item xs={12} md={3} lg={3} key={key}>
                             <Paper className={fixedHeightPaper}>
                                 <Title >{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</Title>
                                     {value.map((value, i) => (<Typography component="p" variant="h4">{value.key}</Typography>))}
                             </Paper>
                         </Grid>
                             )}

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
    metaStatistics: state.patient.metaStatistics
})


export default (connect(mapStateToProps, { getMetaStatistics })(MetaStatistics));
