import React, { useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  ListItemSecondaryAction,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { HabitEditModal } from "../components/EditHabits"; // Adjust the import path as necessary
import {
  Commit,
  CommitHistory,
  DayData,
  DayDataMap,
  Habit,
} from "../utils/types";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";
function getHistoryByDate(
  history: DayDataMap,
  habits: Habit[],
  selectedDate: Dayjs,
): DayData {
  const strippedDate = selectedDate.format("DD.MM.YY");
  return (
    history?.[strippedDate] ?? {
      datetime: selectedDate.toISOString(),
      commits: [],
      currentHabits: habits,
    }
  );
}
interface CommitTabProps {
  commitHistory: CommitHistory;
  setCommitHistory: Function
}
const CommitTab: React.FC<CommitTabProps> = ({ commitHistory, setCommitHistory }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedHabit, setSelectedHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Read a book", archived: false },
    { id: "2", name: "Exercise", archived: false },
    { id: "3", name: "Meditation", archived: false },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const historyDisplay = React.useMemo(
    () => getHistoryByDate(commitHistory.history, habits, selectedDate),
    [commitHistory, selectedDate],
  );

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleAddCommit = () => {
    if (selectedDate && selectedHabit) {
      const newCommit: Commit = {
        id: `commit-${uuidv4()}`,
        datetime: selectedDate.toISOString(),
        habitId: selectedHabit,
      };
      setCommitHistory(
        produce((draftState: CommitHistory) => {
          const dateKey = selectedDate.format("DD.MM.YY");
          if (!draftState.history[dateKey]) {
            draftState.history[dateKey] = {
              datetime: selectedDate.toISOString(),
              commits: [],
              currentHabits: habits.map((habit) => habit.id),
            };
          }

          draftState.history[dateKey].commits.push(newCommit);
        }),
      );
    }
  };

  const handleDeleteCommit = (index: number, id: string) => {
    setCommitHistory(
      produce((draftState: CommitHistory) => {
        const dateKey = selectedDate.format("DD.MM.YY");
        draftState.history[dateKey].commits.splice(index, 1);
      }),
    );
  };

  const handleUpdateHabits = (habits: Habit[]) => {
    setHabits(habits);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(
      produce((draft: Habit[]) => {
        let habit = draft.find((habit) => habit.id === id);
        if (habit) habit.archived = true;
      }),
    );
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };
  const habitById = (id: string, currentHabits: string[]) =>
    habits.find((h) => h.id === id)?.name || "";
  return (
    <Paper
      sx={{
        p: 2,
        mb: 1,
      }}
    >
      <Grid container xs={12} justifyContent={"center"}>
        <Grid
          xs={12}
          sm={7}
          md={7}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
            Commit Your Habit
          </Typography>
          <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
            What did you do?
            <IconButton onClick={toggleEditModal}>
              <EditIcon />
            </IconButton>
          </Typography>
          <FormControl fullWidth sx={{ m: 1, maxWidth: "30ch" }}>
            <InputLabel id="habit-select-label">Habit</InputLabel>
            <Select
              labelId="habit-select-label"
              id="habit-select"
              value={selectedHabit}
              label="Habit"
              onChange={(e) => setSelectedHabit(e.target.value)}
            >
              {habits
                .filter((habit) => !habit.archived)
                .map((habit) => (
                  <MenuItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Habit Edit Modal */}
          <HabitEditModal
            open={isEditModalOpen}
            habits={habits}
            onClose={toggleEditModal}
            onUpdateHabits={handleUpdateHabits}
            onDeleteHabit={handleDeleteHabit}
          />
          <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
            When?
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="When?"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddCommit}>
            Commit
          </Button>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              mt: 2,
              p: 0,
            }}
          >
            {historyDisplay?.commits.map((commit, index) => (
              <ListItem key={commit.id}>
                <ListItemText
                  primary={habitById(
                    commit.habitId,
                    historyDisplay.currentHabits,
                  )}
                  secondary={commit.datetime}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCommit(index, commit.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CommitTab;
