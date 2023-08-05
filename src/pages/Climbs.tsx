import React, { ReactElement, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../AppContext";
import { ArticleFilterParamsType } from "../lib/types";
import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import SavedCrag from "../components/SavedCrag";
import ArticleSearch from "../components/ArticleSearch";
import { Spacing, Wrapper, SavedItemWrapper } from "../components/StyledComponents";

const TodoClimbsWrapper = styled(Wrapper)`
  max-width: 1320px;
`;

const TooltipWrapper = styled.div`
  border: 1px solid #717171;
  background-color: #FFF;
  padding: 2px 4px 0 4px;
`;

const AddItemButton = styled(Button)`
  min-height: 45px;
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
          />
        ))}
      </SavedItemWrapper>
      <AddItemWrapper>
        <Spacing mt="10px">
          <AddItemButton
            style={{ display: isAddCrag ? 'none' : undefined }}
            onClick={() => setIsAddCrag(true)}
          >
            Add Crag
          </AddItemButton>
        </Spacing>
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
            <Spacing mt="10px">
              <AddItemButton
                disabled={false}
                onClick={handleSubmit}
              >
                Save
              </AddItemButton>
            </Spacing>
          </div>
        )}
      </AddItemWrapper>
    </TodoClimbsWrapper>
  )
}

export default Climbs;
