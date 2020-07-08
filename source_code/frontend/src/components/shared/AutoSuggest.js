import Autosuggest from 'react-autosuggest';
import React  from 'react';
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import {  withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { fetchPatientNames } from '../../actions/Actions';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
// Imagine you have a list of languages that you'd like to autosuggest.

const styles ={

 
    input: {width:"100%"},
    inputRoot: {
        color: 'inherit',
        
    },
    container: {
        width:"100%",
        position: "relative",
        
    },
    suggestionsContainerOpen: {
        position: "absolute",
        zIndex: 1000,
        left: 0,
        right: 0
    },
    suggestion: {
        display: "block"
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: "none"
    },
    inputInput: {
        width: '100%',

    },






};


    

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
//const getSuggestionValue = suggestion => suggestion.name;
//console.log(getSuggestionValue)
// Use your imagination to render suggestions.


function renderInputComponent(inputProps) {
    const { classes, inputRef = () => { }, ref, ...other } = inputProps;

    return (
        <TextField
            fullWidth
            id="outlined-dense"
            margin="dense"
            className="autoSuggest"
            style={{ backgroundColor: 'white' }}
           
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: styles.input
                }
            }}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
    return (
        <ListItem selected={isHighlighted} component="div">
            <ListItemText
                primary={
                    parts.map(part => (

                        <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                            {part.text}
                        </span>
                    ))
                }
            />
        </ListItem>
    );
}

class Example extends React.Component {
    constructor() {
        super();

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            patient:'',
            suggestions: [],
            stateSuggestions: [],

        };
    }
    componentDidMount() {
        /*try {
            this.props.fetchPatientNames();
        }
        catch (error) {
            this.props.handleActionStatus({ snackbar: true, variant: "error", message: "Ein fehler ist aufgetreten: " + error })
        }*/
    }
     
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
        
    };
    handleResponse = (response) => {
        this.setState({
            suggestions:response
        });
    }
    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        console.log(value)
        this.props.fetchPatientNames(value, this.handleResponse)
        /*this.setState({
            suggestions: getSuggestions(value)
        });*/
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const {  suggestions, stateSuggestions,patient } = this.state;
        const { classes } = this.props;

        const getSuggestionValue = (suggestion) => {
            console.log(suggestion)
            if (suggestion.name) {
                this.props.getPatientId(suggestion);
                this.setState({ PatientId: suggestion.id })
            }
            return suggestion.name;
        }

        const handleSuggestionsFetchRequested = ({ value }) => {
            this.setState({ stateSuggestions: this.getSuggestions(value) });
        };

        const handleSuggestionsClearRequested = () => {
            this.setState({ stateSuggestions: [] })
        };
        const handleChange = name => (event, { newValue }) => {
            console.log(name)
            this.setState({
                [name]: newValue
            });

        };
        // Finally, render it!
        const autosuggestProps = {
            renderInputComponent,
            suggestions: stateSuggestions,
            onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: handleSuggestionsClearRequested,
            getSuggestionValue,
            renderSuggestion,
        };

        return (
            <Autosuggest
                {...autosuggestProps}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                //inputProps={inputProps}
                inputProps={{
                    classes, id: 5, placeholder: "Select Patient",
                    value: patient, onChange: handleChange("patient")
                }}
                theme={styles}
                renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                        {options.children}
                    </Paper>
                )}
            />
        );
    }
}
Example.propTypes = {
    classes: PropTypes.object.isRequired,
    tenant_names: PropTypes.array.isRequired,
};
const mapStateToProps = state => ({
    //tenant_names: state.patient.tenant_names,
});
export default withStyles(styles)(connect(mapStateToProps, { fetchPatientNames })(Example));
