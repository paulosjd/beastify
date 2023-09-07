import React from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import styled from "styled-components";
import TempPicker from "./TempPicker";
import TextArea from "./TextArea";
import Input from "./Input";
import styles from "./styles.module.css";

const CragInput = styled(Input)`
  min-height: 45px;
  height: 56px;
  width: 17%;
  margin-left: 12px;
`;

type CragFormProps = {
  driveTime: string;
  setDriveTime: (val: string) => void;
  approachTime: string;
  setApproachTime: (val: string) => void;
  geoCoordinates: string;
  setGeoCoordinates: (val: string) => void;
  minTemp: number
  setMinTemp: (val: number) => void;
  maxTemp: number
  setMaxTemp: (val: number) => void;
  conditions: string;
  setConditions: (val: string) => void;
}

const CragForm = (props: CragFormProps) => {

  const {
    driveTime, setDriveTime, approachTime, setApproachTime, geoCoordinates, setGeoCoordinates, minTemp, setMinTemp,
    maxTemp, setMaxTemp, conditions, setConditions
  } = props;

  const timePickSlotProps = {
    textField: {
      error: false,
    }
  };

  return (
    <>
      <div className={styles.mb10} style={{display: 'flex'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={styles.w18pc}>
            <TimePicker
              views={['minutes', ]}
              format="mm"
              label={'Drive time'}
              value={driveTime ? dayjs().minute(parseInt(driveTime)) : ''}
              onChange={( val) => setDriveTime(dayjs(val).minute().toString())}
              sx={{mr: 2}}
              slotProps={timePickSlotProps}
            />
          </div>
          <div className={styles.w18pc}>
            <TimePicker
              views={['minutes', ]}
              format="mm"
              label={'Approach time'}
              value={approachTime ? dayjs().minute(parseInt(approachTime)) : ''}
              onChange={( val) => setApproachTime(dayjs(val).minute().toString())}
              sx={{mr: 2}}
              slotProps={timePickSlotProps}
            />
          </div>
        </LocalizationProvider>
        <CragInput
          value={geoCoordinates}
          name="geoCoordinates"
          placeholder="GeoCoords. e.g. 50.4706,-3.50215"
          onChange={({ target }) => setGeoCoordinates(target.value)}
        />
        <TempPicker
          minTemp={minTemp}
          maxTemp={maxTemp}
          setMinTemp={setMinTemp}
          setMaxTemp={setMaxTemp}
          sxProps={{ width: 300, ml: 6 }}
        />
      </div>
      <TextArea
        value={conditions}
        name="conditions"
        placeholder="Access and conditions"
        onChange={({ target }) => setConditions(target.value)}
        style={{maxHeight: '45px', marginBottom: '10px'}}
      />
    </>
  )
}

export default CragForm;