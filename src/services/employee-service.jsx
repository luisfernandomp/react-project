import http from "../utils/http-axios";

const listar = () => {
  return http.get("users");
};

const getById = (id) => {
  return http.get(`users/${id}`);
};

const create = (user) => {
  return http.post("users", user);
};

const edit = (id, user) => {
  return http.put(`users/${id}`, user);
};

export default {
  listar,
  getById,
  edit,
  create
};
