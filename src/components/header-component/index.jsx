import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function HeaderComponent() {
  return (
    <header>
      <div className="name-company">
        <img
          src="../../assets/images/logo.png"
          alt="Logo da empresa"
          className="logo"
        />
      </div>
      <div className="menu">
        <FontAwesomeIcon icon={faBars} />
      </div>
    </header>
  );
}
