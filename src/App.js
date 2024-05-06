import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import UserDetails from './Components/UserDetails';

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/signup', element: <Signup />},
  {path: '/profile', element: <Profile />},
  {path: '/userdetails', element: <UserDetails />},
])


const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
