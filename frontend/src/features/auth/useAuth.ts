import { useContext } from "react";
import { authContext } from "./context";
import type { AuthContextValue } from "./contextTypes";

export function useAuth(): AuthContextValue {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
