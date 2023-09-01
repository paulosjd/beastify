import React, { ReactElement, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedCrag from "../components/SavedCrag";
import { sortByName } from "../lib/helpers";
import { Spacing, Wrapper, SavedItemWrapper, FormButton, FlexStartRow } from "../components/StyledComponents";
import CragForm from "../components/CragForm";
import CragMap from "../components/CragMap";

const TodoClimbsWrapper = styled(Wrapper)`
  display: flex;
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
  const [approachTime, setApproachTime] = useState<string>('');
  const [driveTime, setDriveTime] = useState<string>('');
  const [minTemp, setMinTemp] = useState<number>(0);
  const [maxTemp, setMaxTemp] = useState<number>(25);
  const [geoCoordinates, setGeoCoordinates] = useState<string>("");
  const [cragName, setCragName] = useState<string>("");
  const [conditions, setConditions] = useState<string>("");
  const [addClimbCragId, setAddClimbCragId] = useState<string>('');
  const { addTodoCrag, getSavedTodoCrags, savedTodoCrags, getSavedTodoClimbs } = useContext(AppContext);
  const [isAddCrag, setIsAddCrag] = useState<boolean>(false);

  useEffect(() => {
    getSavedTodoCrags();
    getSavedTodoClimbs();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    await addTodoCrag({
      name: cragName,
      approachTime,
      driveTime,
      minTemp: minTemp.toString(),
      maxTemp: maxTemp.toString(),
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

  return (
    <TodoClimbsWrapper>
      <CragMap
        markerItems={savedTodoCrags.map(i => ({ name: i.name, coordinates: i.geoCoordinates }))}
      />
      <SavedItemWrapper>
        {savedTodoCrags.sort(sortByName).map((item) => (
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
              driveTime={driveTime}
              setDriveTime={setDriveTime}
              approachTime={approachTime}
              setApproachTime={setApproachTime}
              geoCoordinates={geoCoordinates}
              setGeoCoordinates={setGeoCoordinates}
              minTemp={minTemp}
              setMinTemp={setMinTemp}
              maxTemp={maxTemp}
              setMaxTemp={setMaxTemp}
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
