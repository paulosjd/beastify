import React, { ReactElement, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedCrag from "../components/SavedCrag";
import { Spacing, Wrapper, SavedItemWrapper, FormButton, FlexStartRow } from "../components/StyledComponents";
import {Row} from "../components/ClimbForm";

const TodoClimbsWrapper = styled(Wrapper)`
  max-width: 1320px;
`;

const AddItemWrapper = styled.div`
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%
`;

const Climbs = (): ReactElement => {

  const [editCragId, setEditCragId] = useState<string>("");
  const [viewCragId, setViewCragId] = useState<string>("");
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
    await addTodoCrag({ name: cragName, geoCoordinates, conditions });
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
      <SavedItemWrapper>
        {savedTodoCrags.map((item) => (
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
            <Input
              value={cragName}
              name="cragName"
              placeholder="Crag Name"
              onChange={({ target }) => setCragName(target.value)}
            />
            <Input
              value={geoCoordinates}
              name="geoCoordinates"
              placeholder="GeoCoordinates e.g. 50.4706,-3.50215"
              onChange={({ target }) => setGeoCoordinates(target.value)}
            />
            <TextArea
              value={conditions}
              name="conditions"
              placeholder="Access and Conditions"
              onChange={({ target }) => setConditions(target.value)}
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
