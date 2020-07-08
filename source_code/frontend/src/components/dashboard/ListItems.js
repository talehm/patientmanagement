import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { withRouter} from "react-router-dom";

function ListItems(props) {
        return (
            <div>
                <ListItem button onClick={() => props.history.push("/")}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Patients" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push("/records")}>
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Records" />
                </ListItem>
                <ListItem button onClick={() => props.history.push("/meta_report")}>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Meta Data Statistics" />
                </ListItem>
            </div>
        )
    }

    export default withRouter(ListItems);

