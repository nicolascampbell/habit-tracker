import React, { useState } from "react";
import {
  SwipeableDrawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

interface Habit {
  id: string;
  name: string;
}

interface HabitEditModalProps {
  open: boolean;
  habits: Habit[];
  onClose: () => void;
  onDeleteHabit: Function;
  onUpdateHabits: Function;
}

export const HabitEditModal: React.FC<HabitEditModalProps> = ({
  open,
  habits,
  onClose,
  onUpdateHabits,
}) => {
  const [editedHabits, setEditedHabits] = useState<Habit[]>(habits);

  const handleAdd = () => {
    setEditedHabits(
      produce((draft) => {
        draft.push({
          id: uuidv4(),
          name: "",
        });
      }),
    );
  };

  const handleEditChange = (index: number, value: string) => {
    setEditedHabits(
      produce((draft) => {
        draft[index].name = value;
      }),
    );
  };
  const handleDelete = (index: number) => {
    setEditedHabits(
      produce((draft) => {
        draft.splice(index, 1);
      }),
    );
  };

  function handleSaveHabits() {
    onUpdateHabits(editedHabits.filter((habit) => habit.name !== ""));
    onClose();
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={true}
      PaperProps={{
        sx: { borderRadius: "0.8rem 0.8rem  0 0" },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Habits
          </Typography>
          <IconButton autoFocus color="inherit" onClick={handleSaveHabits}>
            <SaveIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Stack
        direction={"column"}
        justifyContent={"start"}
        alignItems={"center"}
        sx={{ mb: 2, width: "100%" }}
      >
        <List sx={{ width: "100%" }}>
          {editedHabits.map((habit, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <TextField
                fullWidth
                variant="outlined"
                value={habit.name}
                onChange={(e) => handleEditChange(index, e.target.value)}
                autoFocus
              />
            </ListItem>
          ))}
        </List>
        <Button
          color="primary"
          variant="contained"
          aria-label="add"
          onClick={handleAdd}
          sx={{ width: "50%" }}
          startIcon={<AddCircleIcon />}
        >
          Add Habit
        </Button>
      </Stack>
    </SwipeableDrawer>
  );
};
