import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import UserDetails from './Components/UserDetails';
import ForgotPass from './Components/ForgotPass';

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/signup', element: <Signup />},
  {path: '/profile', element: <Profile />},
  {path: '/userdetails', element: <UserDetails />},
  {path: '/forgotpassword', element: <ForgotPass />}
])


const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
