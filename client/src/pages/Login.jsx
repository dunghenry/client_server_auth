import React from "react";
import {
    StyledFormArea,
    StyledFormButton,
    StyledTitle,
    Avatar,
    ButtonGroup,
    ExtraText,
    TextLink,
    CopyrightText,
} from "../components/Styles";
import Logo from "../assets/bg.png";
import { colors } from "../components/Styles";
import { Formik, Form } from "formik";
import { TextInput } from "../components/FormLib";
import { FiMail, FiLock } from "react-icons/fi";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";
import { connect } from "react-redux";
import { loginUser } from "../store/auth/actions/userActions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
const Login = ({ error, loading, loginUser }) => {
    const history = useHistory();
    React.useEffect(() => {
        error &&
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    }, [error]);
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme}>Member Login</StyledTitle>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string()
                            .email("Invalid email address")
                            .required("Required"),
                        password: Yup.string()
                            .min(8, "Password is too short")
                            .max(30, "Password is too long")
                            .required("Required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        loginUser(values, history, setSubmitting);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <TextInput
                                name="email"
                                type="text"
                                label="Email address"
                                placeholder="olaga1@example.com"
                                icon={<FiMail />}
                            />
                            <TextInput
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="*******"
                                icon={<FiLock />}
                            />
                            <ButtonGroup>
                                {!loading && !isSubmitting ? (
                                    <StyledFormButton type="submit">Login</StyledFormButton>
                                ) : (
                                    <ThreeDots color="#BE185D" height={80} width={80} />
                                )}
                            </ButtonGroup>
                        </Form>
                    )}
                </Formik>
                <ExtraText>
                    New here ? <TextLink to="/signup">Signup</TextLink>
                </ExtraText>
            </StyledFormArea>
            <CopyrightText>All right reserved &copy;2022</CopyrightText>
        </div>
    );
};
const mapStateToProps = (state) => ({
    error: state.auth.error,
    loading: state.auth.loading,
});
export default connect(mapStateToProps, { loginUser })(Login);
