import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback, FormGroup, Input } from 'reactstrap';
import { ErrorMessage } from 'formik';

function InputField(props) {
    const { field, form, type, placeholder, disabled } = props;
    const { name } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (
        <FormGroup className="input-form">
            <Input
                id={name}
                type={type}
                disabled={disabled}
                {...field}
                placeholder={placeholder}
                invalid={showError}
            />

            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

InputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

InputField.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disabled: false,
};

export default InputField;
