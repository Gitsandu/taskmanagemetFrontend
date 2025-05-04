import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

/**
 * A reusable confirmation dialog for delete operations
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when the dialog is closed without confirming
 * @param {Function} props.onConfirm - Function to call when the delete is confirmed
 * @param {string} props.title - The title of the dialog
 * @param {string} props.itemName - The name of the item being deleted
 * @param {string} props.itemType - The type of item being deleted (e.g., "task")
 */
const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  itemName,
  itemType = 'item'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete the {itemType} "{itemName}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
