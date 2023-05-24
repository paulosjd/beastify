import styled from "styled-components";

const Button = styled.button`
  border-radius: 4px;
  padding: 10px 15px;
  border: 0;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  background-color: #B89E47;
  box-sizing: border-box;
  width: 100%;
  &:disabled {
    background-color: #a5abaf;
  }
`;
export default Button;
