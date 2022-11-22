import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Date from './Date';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import EditIcon from '@mui/icons-material/Edit';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(props.open);
  const [type] = React.useState(props.type);
  let [rows] = React.useState(props.rowFromPage);
  const [title, titleVal] = React.useState(
    rows.length < 1 || props.index === -1 ? null : rows[props.index].title
  );
  const [description, descVal] = React.useState(
    rows.length < 1 || props.index === -1 ? null : rows[props.index].description
  );
  const [priority, priorityVal] = React.useState(
    rows.length < 1 || props.index === -1 ? null : rows[props.index].priority
  );
  const [deadline, deadlineVal] = React.useState(
    rows.length < 1 || props.index === -1 ? null : rows[props.index].deadline
  );
  const [isComplete] = React.useState(
    rows.length < 1 || props.index === -1 ? null : rows[props.index].isComplete
  );

  const handleClose = () => {
    setOpen(false);
  };

  let cancel = () => {
    props.postForm({
      action: 'cancel',
      data: {},
    });
    handleClose();
  };

  let dialogTitle = () => {
    if (type == 'add') {
      return ' Add Task';
    } else {
      return ' Edit Task';
    }
  };

  let dialogIcon = () => {
    if (type == 'add') {
      return <AddCircleIcon />;
    } else {
      return <EditIcon />;
    }
  };

  let dialogTitleFeild = () => {
    if (type == 'add') {
      return (
        <TextField
          error={
            type === 'add'
              ? title === null || title === '' || duplicateExists(title)
              : false
          }
          value={title}
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          fullWidth
          variant="outlined"
          helperText={titleErrorMessage(title)}
          onChange={(e) => titleVal(e.target.value)}
        />
      );
    }
  };

  let dialogButton = () => {
    if (type == 'add') {
      return 'Add';
    } else {
      return 'Edit';
    }
  };

  let submit = () => {
    if (type == 'add') {
      if (
        title !== '' &&
        description !== '' &&
        priority !== '' &&
        deadline &&
        !duplicateExists(title)
      ) {
        props.postForm({
          action: 'submit',
          data: {
            title: title,
            description: description,
            priority: priority,
            deadline: deadline,
            isComplete: isComplete,
          },
        });
      }
      handleClose();
    } else {
      if (description !== '' && priority !== '' && deadline) {
        props.postForm({
          action: 'edit',
          data: {
            title: title,
            description: description,
            priority: priority,
            deadline: deadline,
            isComplete: isComplete,
          },
          index: props.index,
        });
      }
      handleClose();
    }
  };

  let duplicateExists = (newTitle) => {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].title === newTitle) {
        return true;
      }
    }
    return false;
  };

  let titleErrorMessage = (title) => {
    if (title === '' || title === null) {
      return 'Title is required';
    } else if (duplicateExists(title)) {
      return 'Title already exists';
    } else {
      return '';
    }
  };

  let descErrorMessage = (desc) => {
    if (desc === '' || desc === null) {
      return 'Description is required';
    } else {
      return '';
    }
  };

  return (
    <div>
      <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
        {dialogIcon()}
        {dialogTitle()}
      </DialogTitle>
      <DialogContent>
        {dialogTitleFeild()}
        <TextField
          value={description}
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          fullWidth
          variant="outlined"
          error={type === 'add' ? description === null : false}
          helperText={descErrorMessage(description)}
          onChange={(e) => descVal(e.target.value)}
        />
        <br />
        <br />
        <Date dateFromDialog={deadline} dateToDialog={deadlineVal} />
        <br />
        <br />
        <FormLabel id="demo-row-radio-buttons-group-label">Priority</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e) => priorityVal(e.target.value)}
          value={priority}
        >
          <FormControlLabel value="Low" control={<Radio />} label="Low" />
          <FormControlLabel value="Med" control={<Radio />} label="Med" />
          <FormControlLabel value="High" control={<Radio />} label="High" />
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" startIcon={dialogIcon()} onClick={submit}>
          {dialogButton()}
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DoDisturbIcon />}
          onClick={cancel}
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  );
}
