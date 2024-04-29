import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Signup from './Components/Signup';

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/signup', element: <Signup />},
])


const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
