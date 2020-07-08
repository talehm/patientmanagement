import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
const styles = {
    formError: {
        fontSize: 14, color: 'red', position: 'absolute', bottom: '-10px', left: 16, 
    },
}
function FormValidation(props) {
  const { value } = props.data;
 



  function checkAlphanumeric() {
    var regex1 = new RegExp("^([a-zA-Z0-9 ]+$)([^s]*)$")
    var regex2 = new RegExp("^[0-9]*$")
    var regex = new RegExp(regex1.source + "|" + regex2.source)

    new RegExp()
    if (!regex.test(value)) {
      return "This field only accepts letters and numbers"
    }
    else {
      return false
    }
  }
  function checkAlphabetic() {
      var regex = new RegExp("^$|^[a-zA-Z][a-zA-Z\\s]+$")
    if (!regex.test(value)) {
      return "This field only accepts letters"
    }
    else {
      return false
    }
  }
  function checkEmail() {
      var regex = new RegExp("^^$|^.*@.*\..*$")
    if (!regex.test(value)) {

      return "Email format is wrong"
    } else {
      return false
    }
  }

  function checkNumeric() {
      var regex = new RegExp("^$|^[0-9]+$")
    if (!regex.test(value)) {
      return "This field only accepts digits"
    }
    else {
      return false
    }
  }


  function Validate() {
      const { type, value } = props.data;
      if (typeof value !== 'undefined') {
          switch (type) {
              case 'text':
                  return checkAlphabetic()
              case 'numeric':
                  return checkNumeric();

              case 'email':
                  return checkEmail()

              case 'alphanumeric':
                  return checkAlphanumeric()
              default: break;
          }
    }
  }
  var className = styles.formError
  var content = Validate()
 
  return (
    <span style={className} >{content}</span>
  )
}



export default FormValidation
