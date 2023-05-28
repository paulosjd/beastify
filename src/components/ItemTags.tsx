import React, { ReactElement, useState } from "react";
import { Cancel } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import styled from "styled-components";
import Input from "./Input";

interface TagsProps {
  label: string;
  handleDelete: (value: string) => void;
}

const InputWraper = styled.div`
  display: flex;
`;

const AddButton = styled.button`
  width: 100px;
  background-color: #94c962;
  color: #FFF
`;

const Tag = ({ label, handleDelete }: TagsProps): ReactElement => {
  return (
    <Stack direction='row' gap={1} sx={{ mr: 3 }}>
      <Typography>{label}</Typography>
      <Cancel
        sx={{ cursor: "pointer" }}
        onClick={() => handleDelete(label)}
      />
    </Stack>
  );
};

interface ItemTagsProps {
  tags: string[];
  setTags: (newTags: string[]) => void;
}

export default function ItemTags({ tags, setTags }: ItemTagsProps): ReactElement {
  const [currentTag, setCurrentTag] = useState<string>('')

  const handleDelete = (value: string) => {
    const newTags = tags.filter((val: string) => val !== value);
    setTags(newTags);
  };
  const addTag = () => {
    if (currentTag.length < 25 && tags.length < 5) {
      const newTags = Array.from(new Set([...tags, currentTag]));
      setTags(newTags);
    }
    setCurrentTag('');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <InputWraper >
        <Input
          name="currentTag"
          type="text"
          placeholder="Keywords"
          value={currentTag}
          maxLength={24}
          onChange={({ target }) => setCurrentTag(target.value)}
        />
        <AddButton
          onClick={addTag}
          disabled={!currentTag}
          style={!currentTag ? {backgroundColor: '#a5abaf'} : undefined}
        >
          Add keyword
        </AddButton>
      </InputWraper>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          padding: "0.4rem",
          margin: "0 0.5rem 0 0",
          color: "#1c8e1c",
        }}
      >
        {tags.map(tag => <Tag label={tag} handleDelete={handleDelete} key={tag} />)}
      </Box>
    </Box>
  );
}