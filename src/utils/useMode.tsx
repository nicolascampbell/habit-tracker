import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
export function useMode() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const { value } = await Preferences.get({ key: "mode" });
        if (value) setMode(JSON.parse(value));
      } catch (err) {
        console.log(err);
      }
    };

    fetchMode();
  }, []);

  const handleSaveMode = async (mode: "light" | "dark") => {
    try {
      await Preferences.set({
        key: "mode",
        value: JSON.stringify(mode),
      });
      setMode(mode);
    } catch (err) {
      console.log(err);
    }
  };

  return [mode, handleSaveMode];
}
