import React from 'react'
import { StyledTitle, StyledSubTitle, Avatar, StyledButton, ButtonGroup, StyledFormArea, colors } from '../components/Styles';
import Logo from '../assets/bg.png';
import { logoutUser } from '../store/auth/actions/userActions';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
const Dashboard = ({ logoutUser }) => {
    const history = useHistory();
    const handleLogout = () => {
        logoutUser(history);
    }
    return (
        <div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'transparent',
                width: '100%',
                padding: '25px',
                display: 'flex',
                justifyContent: 'flex-start',
            }}>
                <Avatar image={Logo} />
            </div>
            <StyledFormArea bg={colors.dark2}>
                <StyledTitle size={65}>
                    Welcome, DungHenry
                </StyledTitle>
                <StyledSubTitle size={27}>
                    Feel free to explore our page
                </StyledSubTitle>
                <ButtonGroup>
                    <StyledButton to='' onClick={handleLogout}>
                        Logout
                    </StyledButton>
                </ButtonGroup>
            </StyledFormArea>
        </div>
    )
}

export default connect(null, { logoutUser })(Dashboard);