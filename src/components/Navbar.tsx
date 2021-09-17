import { ReactElement } from "react";
import { useLocation, withRouter } from "react-router";
import styled from "styled-components";

const NavbarStyle = styled.div`
  padding: 20px 20px;
  background: #7c6354;
  min-height: 50px;
  text-align: center;
  color: #f8fcda;
  margin-bottom: 30px;
`;

const NavBar = (): ReactElement => {
  const location = useLocation();

  return (
    <NavbarStyle>
      <h1>{location.pathname.substr(1).toUpperCase()}</h1>
    </NavbarStyle>
  );
};

export default withRouter(NavBar);
