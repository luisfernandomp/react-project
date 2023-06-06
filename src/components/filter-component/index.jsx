import React, { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
registerLocale("ptBR", ptBR);

export default function FilterComponent({
  setUserName,
  setUserStatus,
  startDate,
  endDate,
  handleChange
}) {
  const [isActive, setIsActive] = useState(false);

  function handleChangeName(event) {
    setUserName(event.target.value);
  }

  function handleChangeStatus(event) {
    setUserStatus(event.target.value);
  }

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="container">
      <div className="filter">
        <div className="filter-name">
          <input
            className="input shadow"
            type="text"
            onChange={handleChangeName}
            placeholder="Procure por um funcionário"
          />
          <div className="icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>
        <div className="icon-filter shadow" onClick={handleClick}>
          <FontAwesomeIcon icon={faFilter} />
        </div>
      </div>
      <div
        className="filtros"
        style={{
          display: isActive ? "block" : "none"
        }}
      >
        <div>Filtros</div>
        <div
          className="others-filters"
          style={{
            display: isActive ? "flex" : "none"
          }}
        >
          <DatePicker
            locale="ptBR"
            className="date-picker shadow"
            placeholderText="Intervalo de data"
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
          />
          <select
            onChange={handleChangeStatus}
            className="shadow"
            name="status-user"
            id="status-user"
          >
            <option value="">Selecione um status</option>
            <option value="Active">Ativo</option>
            <option value="Inactive">Inativo</option>
          </select>
        </div>
      </div>
    </div>
  );
}
