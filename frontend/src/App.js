import './App.css';
import Login from './Components/Login';
import Registeration from './Components/Registeration';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/registeration' element={<Registeration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
