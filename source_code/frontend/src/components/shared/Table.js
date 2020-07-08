import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import DescriptionIcon from '@material-ui/icons/Description';

import EditIcon from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import PropTypes from 'prop-types';

class Table extends Component {
    constructor() {
        super()
        this.state = {
        }
    }


    render() {
        const {cols,data}=this.props
        const tableIcons = {
            Check: forwardRef((props, ref) => <Check {...this.props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...this.props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...this.props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...this.props} ref={ref} />),
            Edit: forwardRef((props, ref) => <EditIcon {...this.props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...this.props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...this.props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...this.props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...this.props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...this.props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...this.props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...this.props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...this.props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowUpward {...this.props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...this.props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...this.props} ref={ref} />)
        };
        
        return (
            <MaterialTable
                title=""
                columns={cols}
                data={data}
                icons={tableIcons}
                options={{
                    headerStyle: {
                        backgroundColor: '#f2f2f2',
                        color: '#4d4d4d',
                        fontSize: 16
                    },
                    actionsColumnIndex: -1
                }}
                actions={this.props.actions ? [
                    {
                        icon: () => <DescriptionIcon />,
                        tooltip: 'Save User',
                        onClick: (event, rowData) => this.props.getReport(rowData.id)
                    },
                    {
                        icon: () => <EditIcon />,
                        tooltip: 'Edit Patient',
                        onClick: (event, rowData) => this.props.handlegetpatient(rowData.id)
                    },

                ] : undefined}
            />
        );

    }
}

export default Table;