import "./index.css";
import CardComponent from "../../components/card-component";
import FilterComponent from "../../components/filter-component";
import EmployeeService from "../../services/employee-service";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';

export default function ListEmployee() {
  const [users, setUsers] = useState([]);
  const [nameUser, setNameUser] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [idUser, setIdUser] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setIdUser(id);
    setShow(true);
  };

  let navigate = useNavigate();

  const handleExcluir = async () => {
    await EmployeeService.deleteUser(idUser).then(() => {
      toast.success('Excluído com sucesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        handleClose();
    }).catch(() => {
      toast.error('Não foi possível realizar a operação!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    })
  }

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
  };

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
  
  const listar = useCallback(async () => {
    await EmployeeService.listar().then((resultado) => {
      setUsers(resultado.data);
    });
  }, [users]);

  useEffect(() => {
    listar();
  }, [listar]);


  function undefinedOrNull(value){
    return value === null || value === undefined;
  }

  let usersFilter = users.filter((user) => {
    let userName = user.name.toUpperCase();
    let filterName = nameUser.toUpperCase();
    let date = (new Date(user.date)).setHours(0, 0, 0, 0);

    if(!undefinedOrNull(startDate) && !undefinedOrNull(endDate)){
      if (userName.includes(filterName) && user.status.includes(status)
      && (date >= startDate.setHours(0, 0, 0, 0)  && date <= endDate.setHours(0, 0, 0, 0))){
        return true;
      }
      else return false;
    }else{
      if (userName.includes(filterName) && user.status.includes(status)) return true;
      else return false;
    }
  });

  return (
    <div className="container-list-employee">
      <div className="jumbotron">
        <div className="title-app">
          <h1>Gestor de Funcionários</h1>
        </div>
      </div>
      <div className="list-employee">
      <button className="new-employee" onClick={newEmployee}>
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
              handleShow={handleShow}
            />
          </div>
        );
      }) 
      }
      { usersFilter.length == 0 &&
       (<div className="not-found">
        Nenhum usuário encontrado
        </div>)}
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir funcionário</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja confirmar a exclusão desse funcionário?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
