import * as React from 'react';
import { Component } from 'react';
import './style.css';
import Dialog from './Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DiaWrap from '@mui/material/Dialog';
import { Checkbox } from '@mui/material';
import toastr from 'toastr';

export default class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      open: false,
      type: 'add',
      index: -1,
      data: {},
    };
  }

  addTask = () => {
    this.setState({ type: 'add' });
    this.setState({ index: -1 });
    this.setState({ open: true });
  };

  editTask(index) {
    this.setState({ open: true });
    this.setState({ type: 'edit' });
    this.setState({ index: index });
  }

  postForm = (data) => {
    if (data.action === 'submit') {
      toastr.success(`Task added successfully!`, ``, {
        closeButton: true,
        positionClass: 'toast-bottom-center',
      });
      this.setState({ rows: [...this.state.rows, data.data] });
      this.setState({ open: false });
    } else if (data.action === 'edit') {
      this.editRow(data);
      toastr.success('Task edited successfully!', '', {
        closeButton: true,
        positionClass: 'toast-bottom-center',
      });
      this.setState({ open: false });
    } else {
      this.setState({ open: false });
    }
  };

  editRow = (data) => {
    let newRows = [...this.state.rows];
    newRows[data.index] = data.data;
    this.setState({ rows: newRows });
  };

  setIsComplete = (index) => {
    let newRow = [...this.state.rows];
    newRow[index]['isComplete'] = !newRow[index]['isComplete'];
    this.setState({ rows: newRow });
  };

  render() {
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                FRAMEWORKS
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={this.addTask}
              >
                Add
              </Button>
              <DiaWrap open={this.state.open} onClose={() => this.postForm()}>
                <Dialog
                  type={this.state.type}
                  index={this.state.index}
                  rowFromPage={this.state.rows}
                  postForm={this.postForm}
                />
              </DiaWrap>
            </Toolbar>
          </AppBar>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Deadline</TableCell>
                <TableCell align="right">Priority</TableCell>
                <TableCell align="right">Is Complete</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map((row, index) => (
                <TableRow
                  key={row.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">
                    {new Date(row.deadline).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">{row.priority}</TableCell>
                  <TableCell align="right">
                    <Checkbox
                      checked={row.isComplete}
                      onChange={(e) => {
                        this.setIsComplete(index);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {!row.isComplete && (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => this.editTask(index)}
                      >
                        UPDATE
                      </Button>
                    )}
                    <br />
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        this.setState((oldState) => ({
                          rows: [
                            ...oldState.rows.slice(0, index),
                            ...oldState.rows.slice(index + 1),
                          ],
                        }));
                        toastr.success(`Task deleted successfully!`, ``, {
                          closeButton: true,
                          positionClass: 'toast-bottom-right',
                        });
                      }}
                    >
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
