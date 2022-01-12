/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { FastField, Form, Formik } from 'formik';
import { Button, FormGroup } from 'reactstrap';
import InputField from '../InputField';

Signup.propTypes = {
    onSubmit: PropTypes.func,
};
Signup.defaultProps = {
    onSubmit: null,
};

function Signup(props) {
    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(5, 'Mininum 5 characters')
            .max(25, 'Maximum 25 characters')
            .required('This field is required !'),
        email: Yup.string()
            .email('Invalid email format')
            .required('This field is required !'),
        password: Yup.string()
            .min(8, 'Minimum 8 characters')
            .required('This field is required !'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password')], "Password's not match")
            .required('Required!'),
    });

    return (
        <div className="form__container sign-up-container">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={props.onSubmit}
            >
                {(formikProps) => {
                    const { values, errors, touched, isSubmitting } =
                        formikProps;
                    return (
                        <Form>
                            <h1 className="form__signin-title">
                                Create Account
                            </h1>
                            <div className="form__social-container">
                                <a
                                    className="form__social"
                                    // onClick={handleFbLogin}
                                >
                                    <i className="fab fa-facebook-f" />
                                </a>
                                <a
                                    className="form__social"
                                    // onClick={handleGgLogin}
                                >
                                    <i className="fab fa-google-plus-g" />
                                </a>
                            </div>
                            <span>or use your email for registration</span>
                            <FastField
                                name="name"
                                component={InputField}
                                label="Name"
                                placeholder="Name ..."
                            />
                            <FastField
                                name="email"
                                component={InputField}
                                label="Email"
                                type="email"
                                placeholder="Email ..."
                            />
                            <FastField
                                name="password"
                                component={InputField}
                                label="Password"
                                type="password"
                                placeholder="Password ..."
                            />
                            <FastField
                                name="confirm_password"
                                component={InputField}
                                label="Password"
                                type="password"
                                placeholder="Confirm Password ..."
                            />
                            <FormGroup>
                                <Button type="submit" color="primary">
                                    Signup
                                </Button>
                            </FormGroup>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

Signup.propTypes = {};

export default Signup;
