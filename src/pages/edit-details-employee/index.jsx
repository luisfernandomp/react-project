import * as Yup from "yup";
import "./index.css";
import React, { useState, useEffect, useCallback } from "react";
import EmployeeService from "../../services/employee-service";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import CurrencyInput from "react-currency-input-field";
registerLocale("ptBR", ptBR);

function intialData(user) {
  return {
    email: user.email || "",
    salary: user.salary,
    avatar: user.avatar || "",
    name: user.name || "",
    date: new Date(user.date) || new Date(),
    status: user.status === "Active" || false
  };
}

function convertDate(date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
}

function dataToUser(data, id) {
  console.log(data);
  return {
    _id: id,
    name: data.name,
    avatar: data.avatar,
    email: data.email,
    salary: data.salary,
    date: convertDate(data.date),
    status: data.status ? "Active" : "Inactive",
    __v: 0
  };
}

export default function EditAndDetailsEmployee() {
  const [user, setUser] = useState({
    email: null,
    salary: null,
    avatar: null,
    name: null,
    date: null,
    status: null
  });

  const { id, edit } = useParams();
  const formik = useFormik({
    initialValues: intialData(user),
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      salary: Yup.number().required("Salário obrigatório"),
      email: Yup.string().email("Email inválido").required("Email obrigatório")
    }),
    onSubmit: (values) => {
      let user = dataToUser(values);
      editUser(user);
    }
  });

  let navigate = useNavigate();

  const userCallback = useCallback((user) => {
    setUser(user);
  }, []);

  const editUser = async (user) => {
    await EmployeeService.edit(id, user)
      .then(() => {
          toast.success('Alterado com sucesso!', {
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
      .catch((err) => {
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
      });
  };

  const getUserById = useCallback(async () => {
    await EmployeeService.getById(id).then((resultado) => {
      userCallback(resultado.data);
    });
  }, [id, userCallback]);

  useEffect(() => {
    getUserById();
  }, [getUserById]);

  const back = () => {
    navigate("/");
  };

  return (
    <section className="details-section">
      <div className="edit-details">
      <div className="go-back">
        <button className="back" onClick={back}>
          <FontAwesomeIcon className="icon-arrow" icon={faArrowLeft} />
          Voltar
        </button>
      </div>
      <div className="img-perfil">
        <div
          className="avatar-img"
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
        <p className="user-name">{user.name}</p>
      </div>
      <form className="info-users-details" onSubmit={formik.handleSubmit}>
        <div className="details-user">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            disabled={edit !== "true"}
            type="text"
            onBlur={(e) => formik.setFieldTouched("email", e)}
            onChange={formik.handleChange}
            value={formik.values.email}
            className="input-details"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-400">{formik.errors.email}</span>
          )}
        </div>
        <div className="details-user">
          <label htmlFor="salary">Salário</label>
          <CurrencyInput
            id="salary"
            name="salary"
            disabled={edit !== "true"}
            prefix="R$"
            placeholder="Informe um valor"
            onBlur={(e) => formik.setFieldTouched("salary", e)}
            decimalsLimit={2}
            value={formik.values.salary}
            onValueChange={(value) => {
              formik.setFieldValue("salary", value);
            }}
            className="input-details"
          />
          {formik.touched.salary && formik.errors.salary && (
            <span className="text-red-400">{formik.errors.salary}</span>
          )}
        </div>

        <div className="details-user">
          <label htmlFor="date">Data</label>
          <DatePicker
            id="date"
            name="date"
            locale="ptBR"
            className="input-details"
            todayBtn="linked"
            autoclose={true}
            disabled={edit !== "true"}
            todayHighlight={true}
            dateFormat="dd/MM/yyyy"
            onBlur={(e) => formik.setFieldTouched("date", e)}
            selected={formik.values.date}
            onChange={(value) => {
              formik.setFieldValue("date", value);
            }}
          />
          {formik.touched.date && formik.errors.date && (
            <span className="text-red-400">{formik.errors.date}</span>
          )}
        </div>
        <div className="user-active">
          <label
            htmlFor="status"
            style={{ marginRight: "15px", width: "auto" }}
          >
            Ativo
          </label>
          <input
            id="status"
            name="status"
            disabled={edit !== "true"}
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.status}
          />
        </div>
        {exibirSalvar(edit)}
      </form>
      </div>
    </section>
  );
}

function exibirSalvar(edit) {
  if (edit === "true") {
    return (
      <button className="submit" type="submit">
        Salvar
      </button>
    );
  } else {
    return <></>;
  }
}
