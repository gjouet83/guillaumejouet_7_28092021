import Comment from '../components/Comment';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const Comments = () => {
  const [isOpen, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState();
  const imageInputRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserdecoded = currentUser && jwt_decode(currentUser);
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('postId');

  const getComments = () => {
    setContent('');
    imageInputRef.current.value = '';
    setImage(null);
    axios
      .get('http://localhost:3000/api/comments/get/', {
        headers: { Authorization: `Bearer ${currentUser}` },
        params: { postId: id },
      })
      .then((comments) => {
        setComments(comments.data.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendForm = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('userId', currentUserdecoded.userId);
    formData.append('postId', id);
    formData.append('content', content);
    formData.append('image', image);
    axios({
      headers: { Authorization: `Bearer ${currentUser}` },
      'Content-Type': 'application/json',
      url: 'http://localhost:3000/api/comments/create',
      method: 'POST',
      data: formData,
    })
      .then(() => {
        getComments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleClass = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <main>
      <section className="comments">
        <div className="comments__nav">
          <div className="comments__nav__button">
            <Link
              aria-label="retour vers les posts"
              to="/posts"
              className="comments__nav__button__link clickable"
            ></Link>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              className="comments__nav__button__icon"
            />
            <span className="comments__nav__button__describ">Retour</span>
          </div>
          <h2 className="comments__nav__title">Commentaires</h2>
        </div>
        <form onSubmit={sendForm}>
          <div
            className={
              isOpen
                ? 'comments__createone opencreatepost'
                : 'comments__createone'
            }
          >
            <textarea
              aria-label="zone de rédaction du commentaire"
              className="comments__createone__input"
              placeholder="Redigez votre commentaire ici"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="comments__createone__addfile">
              <input
                aria-label="zone de sélection du fichier"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={imageInputRef}
              />
            </div>
            <div className="comments__createone__footer">
              <button
                className="comments__createone__footer__cancel"
                type="reset"
                onClick={toggleClass}
              >
                Annuler
              </button>
              <button
                className="comments__createone__footer__validate"
                type="submit"
                onClick={toggleClass}
              >
                Valider
              </button>
            </div>
          </div>
        </form>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        <div className="comments__addbutton">
          <button
            aria-label="créer un commentaire"
            className="comments__addbutton__link clickable"
            onClick={toggleClass}
          ></button>
          <FontAwesomeIcon
            className="comments__addbutton__icon"
            icon={faEdit}
          />
        </div>
      </section>
    </main>
  );
};

export default Comments;
