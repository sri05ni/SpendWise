// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           // href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import Dashboard from "./pages/Dashboard";
import Header from "./Header";
import ExpenseForm from "./components/ExpenseForm";
import Income from "./pages/Income";
import IncomeForm from "./components/IncomeForm";
import IntroScreen from "./pages/IntroScreen";

function App() {
    return (
        <BrowserRouter>
        <Header/>
            <Routes>
                <Route path="/" element={<IntroScreen />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-expense" element={<ExpenseForm/>} />
                <Route path="/income" element={<Income/>} />
                <Route path="/add-income" element={<IncomeForm/>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;