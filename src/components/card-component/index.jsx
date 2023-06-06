import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function CardComponent({
  id,
  name,
  image,
  status,
  editUser,
  handleUserClick
}) {
  return (
    <article>
      <div className="info-employee">
        <div className="details" onClick={() => handleUserClick(id)}>
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="image-user"
          ></div>
          <div>
            <p>
              <span className="text-negrito">Nome: </span>
              <span className="info">{name}</span>
            </p>
            {Status(status)}
          </div>
        </div>
        <div className="edit" onClick={() => editUser(id)}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      </div>
    </article>
  );
}

function Status(status) {
  if (status === "Active") {
    return <div className="status status-ativo">Ativo</div>;
  } else {
    return <div className="status status-inativo">Inativo</div>;
  }
}
