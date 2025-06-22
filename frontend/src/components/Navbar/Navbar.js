import "./Navbar.css";
import { useViewMode } from "./ViewModeProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { buttonAction, setButtonAction } = useViewMode();
  const navigate = useNavigate();
  const user_name = localStorage.getItem("user_name");

  const CareTakerIcon = () => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </>
    );
  };

  const PatientIcon = () => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="nav-bg-color">
      <div className="nav-container">
        <div className="logo-part-container">
          <div className="logo-container">M</div>
          <div className="logo-text-container">
            <h1 className="logo-text">MediCare Companion</h1>
            <p className="logo-sub-text">
              {buttonAction ? "Patient View" : "Caretaker View"}
            </p>
          </div>
        </div>
        <div className="btn-container">
          <button
            className="patient-care-taker-button
            "
            onClick={handleLogout}
          >
            Logout
          </button>
          <p className="user-name">{user_name.charAt(0).toUpperCase()}</p>
          <div
            className="patient-care-taker-button"
            onClick={() => setButtonAction(!buttonAction)}
          >
            <div className="icon-cont text-sm">
              {buttonAction ? CareTakerIcon() : PatientIcon()}
            </div>
            <h1 className="text-sm">
              {buttonAction ? "Switch to Caretaker" : "Switch to Patient"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
