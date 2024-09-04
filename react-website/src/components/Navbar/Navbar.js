/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useContext } from "react";
import Container from "../Global/Container";
import Logo from "./NavbarLogo";
import Menu from "./Menu";
import { MyUserContext } from '../../configs/MyContext';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showInvoiceMenu, setShowInvoiceMenu] = useState(false);
  const user = useContext(MyUserContext);

  return (
    <nav css={styles}>
      <Container>
        {/* <Logo /> */}
        <Menu openMenu={openMenu} />

        <i
          onClick={() => setOpenMenu(!openMenu)}
          id="burgerMenu"
          className={
            openMenu ? "fas fa-times fa-lg" : "fas fa-align-right fa-lg"
          }
        ></i>
      </Container>
    </nav>
  );
};

const styles = css`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  padding: 20px 0;
  background-color: #0000CD;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  .container {
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    position: relative;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .manage-bookings,
  .manage-services,
  .manage-bills {
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    position: relative;
    transition: color 700ms ease-in-out;
    &::after {
      position: absolute;
      content: "";
      background: #ff1414;
      width: 100%;
      height: 3px;
      bottom: -33px;
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

  .service-menu, .invoice-menu {
    position: relative;
    &:hover .dropdown {
      display: flex;
    }
    .dropdown {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #0000CD;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      a {
        padding: 10px 20px;
        color: #fff;
        text-decoration: none;
        transition: background-color 700ms ease-in-out;
        &:hover {
          background-color: #ff1414;
        }
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  #burgerMenu {
    cursor: pointer;
    color: #fff;
    display: none;
  }

  @media (max-width: 1200px) {
    .container {
      button {
        display: none;
      }
      #burgerMenu {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }
  }
`;

export default Navbar;