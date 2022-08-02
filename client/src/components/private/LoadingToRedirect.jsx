import React from 'react'
import { useHistory } from 'react-router-dom';

const LoadingToRedirect = () => {
    const history = useHistory();
    const [count, setCount] = React.useState(5);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => --prevCount);
        }, 1000);
        count === 0 && history.push('/login');
        return () => clearInterval(timer);
    }, [count, history])
    return (
        <div>
            <h3 style={{ color: "white" }}>Redirecting you in <span style={{
                color: "#0d6efd", textDecoration:
                    'underline'
            }}>{"0" + count}</span> seconds</h3>
        </div>
    )
}

export default LoadingToRedirect