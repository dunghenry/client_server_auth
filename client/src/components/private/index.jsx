import React from 'react'
import { connect } from 'react-redux';
import LoadingToRedirect from './LoadingToRedirect';
const PrivateRoute = ({ user, children }) => {
    return user ? children : <LoadingToRedirect />
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}
export default connect(mapStateToProps, {})(PrivateRoute)