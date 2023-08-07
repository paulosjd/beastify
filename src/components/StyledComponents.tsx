import styled from "styled-components";
import {Row} from "./ClimbForm";
import Button from "./Button";

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

export const NoDataParagraph = styled.p`
  font-size: 20px;
  color: #1E2828FF;
  margin-top: 40px;
`;

export const SavedItemWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

export const FlexStartRow = styled(Row)`
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
`;

export const FormButton = styled(Button)`
  width: 200px;
  margin: 12px 0 10px 0;
  background-color: #1976d2;
`;