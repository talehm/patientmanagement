import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from "react-redux"
import { signIn } from '../../actions/Actions'
import AuthStore from './AuthStore'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
function useMergeState(initialState) {
    const [state, setState] = React.useState(initialState);
    const setMergedState = newState =>
        setState(prevState => Object.assign({}, prevState, newState)
        );
    return [state, setMergedState];
}
function SignIn(props) {
    const classes = useStyles();
    var [formData, setFormData] = useMergeState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const handleChangeValue = (select, value) => {
        console.log(select, value)
        setFormData({ [select]: value });
    }

    const handleErrorResponse = (error) => {
        console.log(error)
        setErrorMessage(error)
    }
    const handleSuccessfullResponse = () => {
        if (AuthStore.isLoggedIn()) {
            props.history.push("/")
        }
    }
    const signIn = () => {
        props.signIn(formData, handleErrorResponse, handleSuccessfullResponse)
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      onChange={(e)=>handleChangeValue('email',e.target.value )}
          />
          <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={(e) => handleChangeValue('password', e.target.value)}
                  />
                  <p style={{color:"red"}}>  {errorMessage}    </p>
          <Button
                      
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={signIn}
          >
            Sign In
          </Button>
         
        </form>
      </div>

    </Container>
  );
}

const mapStateToProps = state => ({
})

export default (connect(mapStateToProps,{ signIn})(SignIn));