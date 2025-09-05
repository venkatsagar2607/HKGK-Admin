import './App.css';
import Admin from './admin';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login/>}></Route>
        <Route exact path="/Admin" element={<Admin/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
