import React, { ReactElement, useContext, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedCrag from "../components/SavedCrag";
import { sortByName } from "../lib/helpers";
import { Spacing, Row, Wrapper, SavedItemWrapper, FormButton, FlexStartRow } from "../components/StyledComponents";
import CragForm from "../components/CragForm";
import CragMap from "../components/CragMap";
import CragMapOptions from "../components/CragMapOptions";
import { CragFilterOptions } from "../lib/types";

const TodoClimbsWrapper = styled(Wrapper)`
  display: flex;
  width: 80%;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%
`;

const NameInput = styled(Input)`
  margin-bottom: 24px;
`;

const Climbs = (): ReactElement => {

  const [editCragId, setEditCragId] = useState<string>("");
  const [viewCragId, setViewCragId] = useState<string>("");
  const [cragApproachTime, setApproachTime] = useState<string>('');
  const [cragDriveTime, setCragDriveTime] = useState<string>('');
  const [cragMinTemp, setCragMinTemp] = useState<number>(0);
  const [cragMaxTemp, setCragMaxTemp] = useState<number>(25);
  const [geoCoordinates, setGeoCoordinates] = useState<string>("");
  const [cragName, setCragName] = useState<string>("");
  const [conditions, setConditions] = useState<string>("");
  const [addClimbCragId, setAddClimbCragId] = useState<string>('');
  const { addTodoCrag, getSavedTodoCrags, savedTodoCrags, getSavedTodoClimbs } = useContext(AppContext);
  const [isAddCrag, setIsAddCrag] = useState<boolean>(false);
  const defaultFilterOptions = {
    approachTime: '',
    driveTime: '',
    temp: 15
  }
  const [filterOptions, setFilterOptions] = useState<CragFilterOptions>(defaultFilterOptions);

  useEffect(() => {
    getSavedTodoCrags();
    getSavedTodoClimbs();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    await addTodoCrag({
      name: cragName,
      approachTime: cragApproachTime,
      driveTime: cragDriveTime,
      minTemp: cragMinTemp.toString(),
      maxTemp: cragMaxTemp.toString(),
      geoCoordinates,
      conditions
    });
    setGeoCoordinates("");
    setCragName("");
    setConditions("");
    setIsAddCrag(false);
    await getSavedTodoCrags();
  }

  const handleAddCrag = () => {
    setIsAddCrag(true);
    setViewCragId('');
    setEditCragId('');
    setAddClimbCragId('');
  };

  const resetForm = () => {
    setCragName('');
    setGeoCoordinates('');
    setConditions('');
  };

  const cancelAdd = () => {
    setIsAddCrag(false);
    resetForm();
  };

  let todoCrags = savedTodoCrags
  if (filterOptions.temp || filterOptions.temp === 0) {
    todoCrags = todoCrags.filter(crag => parseInt(crag.minTemp) <= filterOptions.temp && parseInt(crag.maxTemp) >= filterOptions.temp)
  }
  if (filterOptions.driveTime && (parseInt(filterOptions.driveTime) || parseInt(filterOptions.driveTime) === 0)) {
    todoCrags = todoCrags.filter(crag => filterOptions.driveTime && parseInt(crag.driveTime) <= parseInt(filterOptions.driveTime))
  }
  if (filterOptions.approachTime && (parseInt(filterOptions.approachTime) || parseInt(filterOptions.approachTime) === 0)) {
    todoCrags = todoCrags.filter(crag => filterOptions.approachTime && parseInt(crag.approachTime) <= parseInt(filterOptions.approachTime))
  }

  return (
    <TodoClimbsWrapper>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <CragMap
            markerItems={todoCrags.map(i => ({ name: i.name, coordinates: i.geoCoordinates }))}
          />
        </Grid>
        <Grid item xs={3}>
          <CragMapOptions
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
        </Grid>
      </Grid>
      <SavedItemWrapper>
        {todoCrags.sort(sortByName).map((item) => (
          <SavedCrag
            key={item.id}
            savedItem={item}
            editItemId={editCragId}
            setEditItemId={setEditCragId}
            viewItemId={viewCragId}
            setViewItemId={setViewCragId}
            addClimbCragId={addClimbCragId}
            setAddClimbCragId={setAddClimbCragId}
            cancelAddCrag={cancelAdd}
          />
        ))}
      </SavedItemWrapper>
      <AddItemWrapper>
        {!viewCragId && !editCragId && (
          <FlexStartRow>
            <FormButton
              style={{ display: isAddCrag ? 'none' : undefined }}
              onClick={handleAddCrag}
            >
              Add Crag
            </FormButton>
          </FlexStartRow>
        )}
        {isAddCrag && (
          <div>
            <NameInput
              value={cragName}
              name="cragName"
              placeholder="Crag Name"
              onChange={({ target }) => setCragName(target.value)}
            />
            <CragForm
              driveTime={cragDriveTime}
              setDriveTime={setCragDriveTime}
              approachTime={cragApproachTime}
              setApproachTime={setApproachTime}
              geoCoordinates={geoCoordinates}
              setGeoCoordinates={setGeoCoordinates}
              minTemp={cragMinTemp}
              setMinTemp={setCragMinTemp}
              maxTemp={cragMaxTemp}
              setMaxTemp={setCragMaxTemp}
              conditions={conditions}
              setConditions={setConditions}
            />
            <FlexStartRow>
              <FormButton onClick={cancelAdd} >
                Cancel
              </FormButton>
              <FormButton
                disabled={!cragName}
                onClick={handleSubmit}
              >
                Save
              </FormButton>
            </FlexStartRow>
          </div>
        )}
      </AddItemWrapper>
    </TodoClimbsWrapper>
  )
}

export default Climbs;
