import { createContext } from "react";
import type { AuthContextValue } from "./contextTypes";

export const authContext = createContext<AuthContextValue | undefined>(
  undefined,
);
