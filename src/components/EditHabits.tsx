import React, { useState } from 'react';
import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  TextField,
  Stack,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { TransitionProps } from '@mui/material/transitions';
import { produce } from 'immer';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface Habit {
  id: string;
  name: string;
}

interface HabitEditModalProps {
  open: boolean;
  habits: Habit[];
  onClose: () => void;
  onDeleteHabit: (habit: string) => void; // Changed to index for precise deletion
  onUpdateHabits: (editedHabits: Habit[]) => void; // New prop for updating habits
}


export const HabitEditModal: React.FC<HabitEditModalProps> = ({
  open,
  habits,
  onClose,
  onDeleteHabit,
  onUpdateHabits,
}) => {
  const [editedHabits, setEditedHabits] = useState<Habit[]>(habits);

  const handleAdd = () => {
    setEditedHabits(produce((draft) => {
      draft.push({
        id: uuidv4(),
        name: ''
      })
    }))
  };

  const handleEditChange = (index: number, value: string) => {
    setEditedHabits(produce((draft) => {
      draft[index].name = value
    }));
  };
  function handleSaveHabits() {
    onUpdateHabits(editedHabits.filter(habit => habit.name !== ''))
    onClose()
  }
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
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
      <Stack direction={'column'} justifyContent={'start'} alignItems={'center'}>
        <List>
          {editedHabits.map((habit, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteHabit(habit.id)}>
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
          aria-label="add"
          onClick={handleAdd}
          sx={{ px: '1rem', borderRadius: '1rem', maxWidth: '3rem' }}
        >
          <AddIcon />
        </Button>

      </Stack>
    </Dialog>
  );
};

