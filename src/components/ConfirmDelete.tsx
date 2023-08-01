import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
};

const ConfirmDelete = (props: DialogProps) => {
  const { open, onClose, handleDelete } = props;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    handleDelete();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Confirm delete?</DialogTitle>
      <Button onClick={handleConfirm}>
        Delete
      </Button>
    </Dialog>
  );
}

export default ConfirmDelete;