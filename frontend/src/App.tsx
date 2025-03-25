import { BrowserRouter, Route, Routes } from "react-router-dom";

//Login and SignUp
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

//Main Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Explore from "./pages/Explore";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";

//Documentations
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Error404 from "./pages/Error404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
