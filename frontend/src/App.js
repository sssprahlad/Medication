import React from 'react';
import "./App.css";
import MainContainer from './components/MainContainer';
import { ViewModeProvider } from "./components/Navbar/ViewModeProvider";
import SignUp from './components/LoginAndSignUp/SignUp/SignUp';
import Login from './components/LoginAndSignUp/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; 
import NotFound from './components/NotFound/NotFound';
import Welcome from './components/Welcome/Welcom';
function App() {
  
  return (
    <Router>
      <div className="App">
      <ViewModeProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={
           
              <ProtectedRoute>
                <MainContainer />
              </ProtectedRoute>
           
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ViewModeProvider>
      </div>
    </Router>
  );
}

export default App;
