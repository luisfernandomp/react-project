import "./index.css";
import CardComponent from "../../components/card-component";
import FilterComponent from "../../components/filter-component";
import EmployeeService from "../../services/employee-service";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function ListEmployee() {
  const [users, setUsers] = useState([]);
  const [nameUser, setNameUser] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let navigate = useNavigate();

  const listarEquipamentos = async () => {
    await EmployeeService.listar().then((resultado) => {
      setUsers(resultado.data);
    });
  };

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  function convertDate(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
  }

  function handleUserClick(id) {
    navigate(`/details-employee/${id}/false`);
  }

  function editUser(id) {
    navigate(`/details-employee/${id}/true`);
  }

  function newEmployee(event) {
    event.preventDefault();
    navigate(`/create-employee`);
  }

  useEffect(() => {
    listarEquipamentos();
  }, [users]);

  let usersFilter = users.filter((user) => {
    let userName = user.name.toUpperCase();
    let filterName = nameUser.toUpperCase();
    //let date = new Date(user.date);

    //console.log(date);

    if (userName.includes(filterName) && user.status.includes(status))
      return true;
    return false;
  });

  return (
    <>
      <div className="jumbotron">
        <div className="title-app">
          <h1>Gestor de Funcionários</h1>
        </div>
      </div>
      <button className="new-employee shadow" onClick={newEmployee}>
        <FontAwesomeIcon
          style={{ fontSize: "1.2em", fontWeight: 200 }}
          icon={faCirclePlus}
        />
        {"    "}
        Adicionar
      </button>
      <FilterComponent
        setUserName={setNameUser}
        setUserStatus={setStatus}
        startDate={startDate}
        endDate={endDate}
        handleChange={handleChange}
      />
      {usersFilter.map((user) => {
        return (
          <div key={user._id}>
            <CardComponent
              id={user._id}
              name={user.name}
              image={user.avatar}
              status={user.status}
              editUser={editUser}
              handleUserClick={handleUserClick}
            />
          </div>
        );
      })}
    </>
  );
}
