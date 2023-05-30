import styled from "styled-components";

export const Spacing = styled.div<{
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
  mx?: string;
  my?: string;
  fitContent?: boolean;
  float?: string;
}>`
  margin-top: ${({my, mt}) => mt || my};
  margin-bottom: ${({my, mb}) => mb || my};
  margin-right: ${({mx, mr}) => mr || mx};
  margin-left: ${({mx, ml}) => ml || mx};
  width: ${({fitContent}) => (fitContent ? "fitContent" : "100%")};
  float: ${({float}) => (float ? float : 'left')};
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
