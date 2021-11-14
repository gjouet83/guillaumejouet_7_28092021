import axios from 'axios';
import { useEffect, useState } from 'react';

const UsersTable = ({ user }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // on vérifie si le token est présent dans le localstorage
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');

  const handleChange = () => {
    setChecked(!checked);
  };

  //fonction mise a jour user => admin
  const sendForm = () => {
    const updatedUser = {
      userId: user.id,
      admin: checked,
    };
    axios
      .put('http://localhost:3000/api/users/update/:id', updatedUser, {
        headers: { Authorization: `Bearer ${currentUser}` },
      })
      .then((ok) => {
        console.log(ok);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fonction suppression d'un user
  const deleteUser = () => {
    axios
      .delete('http://localhost:3000/api/users/delete/:id', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { userId: user.id },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //après le premier render on n'affiche pas le user "admin", pour empécher sa suppression de la table
    if (user.username == 'Admin') {
      setIsAdmin('disappear');
    }
    //on verifie si le user est admin ou pas et on met a jour le satut
    if (user.admin == 1) {
      setChecked(true);
    }
  }, []);

  return (
    <div className="admin__userarray">
      <h3 className={`admin__userarray__name ${isAdmin}`}>{user.username}</h3>
      <button
        className={`admin__userarray__userdelete ${isAdmin}`}
        type="button"
        onClick={deleteUser}
      >
        Supprimer l'utilisateur
      </button>
      <form
        className={`admin__userarray__element ${isAdmin}`}
        onSubmit={sendForm}
      >
        <label className="admin__userarray__element__lbl">
          isAdmin ?
          <input
            className="admin__userarray__element__input"
            type="checkbox"
            id="admin"
            name="admin"
            checked={checked}
            onChange={handleChange}
          ></input>
        </label>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default UsersTable;
