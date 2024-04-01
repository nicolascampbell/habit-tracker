import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import { CommitHistory} from "./types";
import dayjs from "dayjs";
const DEFAULT_COMMIT_HISTORY: CommitHistory = {
  history: {},
  datetime: dayjs().toISOString(),

}
export function useCommitHistory() {
  const [commitHistory, setCommitHistory] = useState<CommitHistory>(DEFAULT_COMMIT_HISTORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommitHistory = async () => {
      try {
        const { value } = await Preferences.get({ key: "commitHistory" });
        if (value) setCommitHistory(JSON.parse(value))
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitHistory();
  }, []);

  const updateCommitHistory = async (commitHistory:CommitHistory) => {
    try {
      await Preferences.set({
        key: "commitHistory",
        value: JSON.stringify(commitHistory),
      });
      setCommitHistory(commitHistory);
    } catch (err) {
      setError(err as Error);
    }
  };

  return [commitHistory, updateCommitHistory, loading, error];
}
