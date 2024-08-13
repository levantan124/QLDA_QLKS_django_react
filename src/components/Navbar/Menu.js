/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useContext } from "react";
import { Link } from 'react-router-dom';

import { MyUserContext, MyDispatchContext } from "../../configs/MyContext";
const Menu = ({ openMenu }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const handleLogout = () => {
    dispatch({ type: "logout" });
    // window.location.reload(); // Navigate to the home page or any other desired route after logout
};

  return (
      <div css={styles} className={openMenu ? "menu" : "hidden"}>
          <a href=""><Link to="/">Home</Link></a>
          {user ? (
                <div className="user-section">
                    <a><Link to="/info">{user.name}</Link></a>
                    <a onClick={handleLogout}><Link to="/">Đăng xuất</Link></a>
                </div>
            ) : (
                <a href="/login">Đăng nhập</a>
            )}
      </div>
  );
};

const styles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0000CD;
  padding: 10px 0;

  a {
    text-decoration: none;
    text-transform: uppercase;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin: 0 22px;
    position: relative;
    transition: color 700ms ease-in-out;
    &::after {
      position: absolute;
      content: "";
      background: #ff1414;
      width: 100%;
      height: 3px;
      bottom: -5px;
      left: 0;
      opacity: 0;
      transition: opacity 700ms ease-in-out;
    }
    &:hover {
      color: #ff1414;
      &::after {
        opacity: 1;
      }
    }
  }

  .user-section {
    display: flex;
    align-items: center;
    a {
      margin: 0 22px;
    }
  }

  @media (max-width: 1225px) {
    flex-direction: column;
    padding: 80px 40px;
    z-index: 30;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    min-height: 96vh;
    width: 100%;
    max-width: 320px;
    transition: left 100ms ease-in-out, opacity 100ms ease-in-out;
    &.hidden {
      left: -500px;
      opacity: 0;
    }
    a {
      margin: 20px 0;
      font-size: 25px;
      text-align: left;
      user-select: none;
      &:hover {
        color: 	#20B2AA;
        &::after {
          opacity: 0;
        }
      }
    }
  }
`;

export default Menu;