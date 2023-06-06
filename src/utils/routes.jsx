import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListEmployee from "../pages/list-employee";
import EditAndDetailsEmployee from "../pages/edit-details-employee";
import NoPage from "../pages/no-page";
import App from "../App";
import HeaderComponent from "../components/header-component";
import FooterComponent from "../components/footer-component";
import CreateEmployee from "../pages/create-employee";

const Rotas = (
  <BrowserRouter>
    <HeaderComponent />
    <Routes>
      <Route index element={<ListEmployee />} />
      <Route
        path="/details-employee/:id/:edit"
        element={<EditAndDetailsEmployee />}
      />
      <Route path="/create-employee" element={<CreateEmployee />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    <FooterComponent />
  </BrowserRouter>
);

export default Rotas;
