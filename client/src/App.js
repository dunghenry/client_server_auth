import { StyledContainer } from './components/Styles';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/private';
const App = () => {
  return (
    <Router>
      <StyledContainer>
        <Switch>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/dashboard" exact>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </StyledContainer>
    </Router>
  )
}

export default App