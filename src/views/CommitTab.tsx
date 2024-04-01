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
  Stack,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { useHabits } from "../utils/useHabits";
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
  updateCommitHistory: Function;
}
const CommitTab: React.FC<CommitTabProps> = ({
  commitHistory,
  updateCommitHistory,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  //@ts-ignore
  const [habits, updateHabits, loading, error]: [Habit[], Function, boolean, any] = useHabits();
  const [selectedHabit, setSelectedHabit] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  React.useEffect(() => {
    if (habits.length > 0 && selectedHabit === '') {
      setSelectedHabit(habits[0].id);
    }
  }, [habits, selectedHabit]);
  const historyDisplay = React.useMemo(
    () => getHistoryByDate(commitHistory.history, habits, selectedDate),
    [commitHistory, selectedDate],
  );

  const handleDateChange = (date: Dayjs | null) => {
    if (date) setSelectedDate(date);
  };

  const handleAddCommit = () => {
    if (selectedDate && selectedHabit) {
      const newCommit: Commit = {
        id: `commit-${uuidv4()}`,
        datetime: selectedDate.toISOString(),
        habitId: selectedHabit,
      };
      updateCommitHistory(
        produce(commitHistory, (draftState: CommitHistory) => {
          const dateKey = selectedDate.format("DD.MM.YY");
          if (!draftState.history[dateKey]) {
            draftState.history[dateKey] = {
              datetime: selectedDate.toISOString(),
              commits: [],
              currentHabits: habits.map((habit) => habit.id),
            };
          }
          //@ts-ignore
          draftState?.history?.[dateKey]?.commits.push(newCommit);
        }),
      );
    }
  };

  const handleDeleteCommit = (index: number) => {
    updateCommitHistory(
      produce(commitHistory, (draftState: CommitHistory) => {
        const dateKey = selectedDate.format("DD.MM.YY");
        //@ts-ignore
        draftState.history[dateKey].commits.splice(index, 1);
      }),
    );
  };

  const handleUpdateHabits = (habits: Habit[]) => {
    updateHabits(habits);
  };

  const handleDeleteHabit = (id: string) => {
    updateHabits(
      produce((draft: Habit[]) => {
        let habit = draft.find((habit) => habit.id === id);
        if (habit) habit.archived = true;
      }),
    );
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };
  const habitById = (id: string) => habits.find((h) => h.id === id)?.name || "";
  return (
    <Paper
      sx={{
        p: 2,
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
            Commit your Habit
          </Typography>
          <Stack direction={'row'} sx={{ width: '100%' }} alignItems={'center'}>
            <FormControl fullWidth sx={{ m: 1, ml: 0, flexGrow: 2 }}>
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
            <IconButton onClick={toggleEditModal}>
              <EditIcon />
            </IconButton>
          </Stack>
          {/* Habit Edit Modal */}
          <HabitEditModal
            open={isEditModalOpen}
            habits={habits}
            onClose={toggleEditModal}
            onUpdateHabits={handleUpdateHabits}
            onDeleteHabit={handleDeleteHabit}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: "100%" }}
              label="When?"
              value={selectedDate}
              format="DD. MMMM YYYY"
              onChange={handleDateChange}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{ mt: 2, width: "50%" }}
            onClick={handleAddCommit}
          >
            Commit
          </Button>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              mt: 2,
              p: 0,
            }}
          >
            {(historyDisplay?.commits ?? []).map((commit, index) => (
              <ListItem key={commit.id}>
                <ListItemText
                  primary={habitById(commit.habitId)}
                  secondary={dayjs(commit.datetime).format("DD. MMMM YYYY")}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCommit(index)}
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
