import axios from "axios";

export default axios.create({
  baseURL: "https://mack-webmobile.vercel.app/api",
  headers: {
    "Content-type": "application/json"
  }
});
