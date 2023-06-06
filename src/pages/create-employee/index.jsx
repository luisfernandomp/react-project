import * as Yup from "yup";
import "./index.css";
import React from "react";
import EmployeeService from "../../services/employee-service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";
import { useFormik, TextField } from "formik";
import { useToasts } from "react-toast-notifications";
import CurrencyInput from "react-currency-input-field";
registerLocale("ptBR", ptBR);

function convertDate(date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
}

function dataToUser(data, id) {
  return {
    name: data.name,
    email: data.email,
    salary: data.salary,
    avatar: data.avatar,
    date: convertDate(data.date),
    status: data.status ? "Active" : "Inactive"
  };
}

export default function CreateEmployee() {
  const { addToast } = useToasts();
  const formik = useFormik({
    initialValues: {
      email: "",
      avatar: "",
      salary: 0,
      name: "",
      date: Date.now(),
      status: false
    },
    validationSchema: Yup.object().shape({
      salary: Yup.number().required("Salário obrigatório"),
      email: Yup.string().email("Email inválido").required("Email obrigatório"),
      name: Yup.string()
        .min(5, "Mínimo de 5 caracteres")
        .required("Nome obrigatório"),
      avatar: Yup.string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Url inválida!"
        )
        .required("Url obrigatória")
    }),
    onSubmit: (values, { resetForm }) => {
      let user = dataToUser(values);
      createUser(user);
      resetForm({ values: "" });
    }
  });

  let navigate = useNavigate();

  const createUser = async (user) => {
    await EmployeeService.create(user)
      .then(() => {
        addToast("Cadastrado com suceso!", { appearance: "success" });
      })
      .catch((err) => {
        console.log(err);
        addToast("Não foi possível concluir a operação!", {
          appearance: "error"
        });
      });
  };

  const back = () => {
    navigate("/");
  };

  const returnImage = () => {
    if (
      formik.values.avatar !== null &&
      formik.values.avatar !== undefined &&
      formik.values.avatar !== ""
    ) {
      return (
        <div
          className="avatar-image-url shadow"
          style={{ backgroundImage: `url(${formik.values.avatar})` }}
        ></div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <section className="details-section">
      <div className="go-back">
        <button className="back" onClick={back}>
          <FontAwesomeIcon className="icon-arrow" icon={faArrowLeft} />
          Voltar
        </button>
      </div>

      <form className="info-users-details" onSubmit={formik.handleSubmit}>
        <h1>Cadastrar funcionário</h1>
        <div className="details-user">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nome"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="input-details"
          />
          {formik.touched.name && formik.errors.name && (
            <span className="text-red-400">{formik.errors.name}</span>
          )}
        </div>
        <div className="details-user">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            placeholder="Email"
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
          <label htmlFor="email">avatar</label>
          <input
            id="avatar"
            name="avatar"
            placeholder="https://example.com"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.avatar}
            className="input-details"
          />
          {formik.touched.avatar && formik.errors.avatar && (
            <span className="text-red-400">{formik.errors.avatar}</span>
          )}
          {returnImage()}
        </div>
        <div className="details-user">
          <label htmlFor="salary">Salário</label>
          <CurrencyInput
            id="salary"
            name="salary"
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
            todayHighlight={true}
            dateFormat="dd/MM/yyyy"
            selected={formik.values.date}
            onChange={(value) => {
              console.log(value);
              formik.setFieldValue("date", value);
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
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.status}
          />
        </div>
        <button className="submit" type="submit">
          Cadastrar
        </button>
      </form>
    </section>
  );
}
