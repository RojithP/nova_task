import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./view/Home/Home";
import Login from "./view/Login/Login";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./view/Register/Register";
import { ToastContainer, toast } from 'react-toastify';
import { Fragment } from "react";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={ProtectedRoute}>
            <Route path="/" Component={Home} />
          </Route>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
