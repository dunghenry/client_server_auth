import React from 'react'
import { StyledFormArea, StyledFormButton, StyledTitle, Avatar, ButtonGroup, ExtraText, TextLink, CopyrightText } from '../components/Styles';
import Logo from '../assets/bg.png';
import { colors } from '../components/Styles';
import { Formik, Form } from 'formik';
import { TextInput } from '../components/FormLib';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { ThreeDots } from 'react-loader-spinner'
import { connect } from 'react-redux';
import { signupUser } from '../store/auth/actions/userActions';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
const Signup = ({ loading, error, signupUser }) => {
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
        <StyledTitle color={colors.theme}>
          Member Signup
        </StyledTitle>
        <Formik
          initialValues={{
            email: '',
            password: '',
            repeatPassword: '',
            name: '',
          }}
          validationSchema={
            Yup.object({
              email: Yup.string().email('Invalid email address').required("Required"),
              password: Yup.string().min(8, "Password is too short").max(30, "Password is too long").required("Required"),
              name: Yup.string().required("Required"),
              repeatPassword: Yup.string().required("Required").oneOf([Yup.ref('password')], "Password must match")
            })
          }
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            signupUser(values, history, setSubmitting);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="name"
                type="text"
                label="Full Name"
                placeholder="Johnny Depp"
                icon={<FiUser />}
              />
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
              <TextInput
                name="repeatPassword"
                type="password"
                label="Repeat Password"
                placeholder="*******"
                icon={<FiLock />}
              />
              <ButtonGroup>
                {!loading && !isSubmitting ? (
                  <StyledFormButton type="submit">Signup</StyledFormButton>
                ) : (
                  <ThreeDots color="#BE185D" height={80} width={80} />
                )}

              </ButtonGroup>
            </Form>
          )}
        </Formik>
        <ExtraText>
          Already have an account ? <TextLink to="/login">Login</TextLink>
        </ExtraText>
      </StyledFormArea>
      <CopyrightText>
        All right reserved &copy;2022
      </CopyrightText>
    </div>
  )
}
const mapStateToProps = (state) => ({
  loading: state.auth.loading,
});
export default connect(mapStateToProps, { signupUser })(Signup);