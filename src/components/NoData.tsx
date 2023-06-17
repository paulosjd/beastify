import React from "react";

type NoDataProps = {
  wrapper: React.ElementType;
}

const NoData = ({ wrapper: Wrapper }: NoDataProps) => {
  return (
    <Wrapper>
      <h1>No Data</h1>
    </Wrapper>
  );
};

export default NoData;