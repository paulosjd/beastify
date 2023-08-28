import React, { useEffect, useState, ReactElement } from "react";
import { IconButton } from "@mui/material";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Dayjs } from "dayjs";
import dayjs from 'dayjs';
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import { AppContext } from "../AppContext";
import { sortByName } from "../lib/helpers";
import { SavedTodoCragType } from "../lib/types";
import { Spacing, FormButton, Row, FlexStartRow } from "./StyledComponents";
import TextArea from "./TextArea";
import TempPicker from "./TempPicker";
import ClimbForm from "./ClimbForm";
import ConfirmDelete from "./ConfirmDelete";
import styles from "./styles.module.css";

type SavedCragInfoProps = {
  driveTime: string;
  approachTime: string;
  maxTemp: string;
  minTemp: string;
}

const ItemText = styled.p`
  margin: 0 15px 0 0;
  padding-top: 3px;
`;

const SavedCragInfo = (props: SavedCragInfoProps): ReactElement => {

  const { driveTime, approachTime, maxTemp, minTemp } = props;

  return (
    <div>
      <FlexStartRow className={styles.mb10}>
        {driveTime && (
            <>
              <DriveEtaIcon />
              <ItemText>{`${driveTime} minutes`}</ItemText>
            </>
        )}
        {approachTime && (
          <>
            <DirectionsWalkIcon />
            <ItemText>{`${approachTime} minutes`}</ItemText>
          </>
        )}
        {(maxTemp || minTemp) && (
          <>
            <ThermostatIcon />
            <ItemText>{`${minTemp || 0}°C - ${maxTemp || 25}°C`}</ItemText>
          </>
        )}
      </FlexStartRow>
    </div>
  );
};

export default SavedCragInfo;