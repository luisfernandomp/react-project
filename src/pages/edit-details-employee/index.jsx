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
import { useFormik, TextField } from "formik";
import { useToasts } from "react-toast-notifications";
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
  const { addToast } = useToasts();
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
        addToast("Alterado com suceso!", { appearance: "success" });
      })
      .catch((err) => {
        addToast("Não foi possível concluir a operação!", {
          appearance: "error"
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
            selected={formik.values.date}
            onChange={(value) => {
              formik.setFieldValue("date", Date.parse(value));
            }}
            renderInput={(params) => <TextField {...params} />}
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
