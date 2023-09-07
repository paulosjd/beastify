import React, {useState} from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import styled from "styled-components";
import TempPicker from "./TempPicker";
import TextArea from "./TextArea";
import Input from "./Input";
import { CragFilterOptions } from "../lib/types";
import styles from "./styles.module.css";

const CragInput = styled(Input)`
  min-height: 45px;
  height: 56px;
  width: 17%;
  margin-left: 12px;
`;

type CragMapOptionsProps = {
  filterOptions: CragFilterOptions;
  setFilterOptions: (val: CragFilterOptions) => void;
}

const CragMapOptions = (props: CragMapOptionsProps) => {

  const { filterOptions, setFilterOptions } = props;
  const { driveTime, approachTime, temp } = filterOptions;

  const setDriveTime = (val: string) => {
    setFilterOptions({ ...filterOptions, driveTime: val })
  };
  const setApproachTime = (val: string) => {
    setFilterOptions({ ...filterOptions, approachTime: val })
  };
  const setTemp = (val: number) => {
    setFilterOptions({ ...filterOptions, temp: val })
  };

  const timePickSlotProps = {
    textField: {
      error: false,
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={styles.w50pc}>
          <TimePicker
            views={['minutes', ]}
            format="mm"
            label={'Maximum drive time'}
            value={driveTime ? dayjs().minute(parseInt(driveTime)) : ''}
            onChange={( val) => setDriveTime(dayjs(val).minute().toString())}
            sx={{ my: 2 }}
            slotProps={timePickSlotProps}
          />
        </div>
        <div className={styles.w50pc}>
          <TimePicker
            views={['minutes', ]}
            format="mm"
            label={'Maximum approach time'}
            value={approachTime ? dayjs().minute(parseInt(approachTime)) : ''}
            onChange={( val) => setApproachTime(dayjs(val).minute().toString())}
            sx={{ my: 2 }}
            slotProps={timePickSlotProps}
          />
        </div>
      </LocalizationProvider>
      <TempPicker
        temp={temp}
        setTemp={setTemp}
        sxProps={{ width: 200, py: 2 }}
        single
      />
    </>
  )
}

export default CragMapOptions;