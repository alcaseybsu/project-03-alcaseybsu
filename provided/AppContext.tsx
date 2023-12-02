import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * DO NOT change this file.
 */

import { Attending, Session, User, Vote } from "./types";
import { useFakeBackend } from "../backend/FakeBackend";

const REFRESH_INTERVAL = 5 * 1000;

export interface AppState {
  currentSession?: Session;
  user?: User;
  addSuggestion?: (sessionId: string, name: string) => void;
  inviteUser?: (sessionId: string, name: string) => void;
  updateResponse?: (
    sessionId: string,
    accepted: boolean,
    attending: Attending,
  ) => void;
  updateVote?: (sessionId: string, suggestionId: string, vote: Vote) => void;
}

const AppContext = createContext<AppState>({});

export function useAppContext(): AppState {
  return useContext(AppContext);
}

interface Props {
  pauseUpdates?: boolean;
  refreshInterval?: number;
}

export function AppContextProvider({
  pauseUpdates,
  refreshInterval,
  children,
}: PropsWithChildren<Props>) {
  const [user, setUser] = useState<User>();
  const [currentSession, setCurrentSession] = useState<Session>();

  const backend = useFakeBackend();

  useEffect(() => {
    backend.fetchSelf().then((s) => setUser(s));
    backend.fetchSession().then((session) => setCurrentSession(session));
  }, []);

  useEffect(() => {
    if (!pauseUpdates) {
      const interval = setInterval(() => {
        // log("Sending session refresh to backend");
        backend.fetchSession().then((session) => setCurrentSession(session));
      }, refreshInterval ?? REFRESH_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    }
  }, [backend.fetchSession, setCurrentSession, pauseUpdates, refreshInterval]);

  const addSuggestion = useCallback(
    (sessionId: string, name: string) => {
      backend.addSuggestion(sessionId, name).then((s) => setCurrentSession(s));
    },
    [backend.addSuggestion, setCurrentSession],
  );

  const inviteUser = useCallback(
    (sessionId: string, name: string) => {
      backend.inviteUser(sessionId, name).then((s) => setCurrentSession(s));
    },
    [backend.inviteUser, setCurrentSession],
  );

  const updateResponse = useCallback(
    (sessionId: string, accepted: boolean, attending: Attending) => {
      backend
        .updateResponse(sessionId, accepted, attending)
        .then((s) => setCurrentSession(s));
    },
    [backend.updateResponse, setCurrentSession],
  );

  const updateVote = useCallback(
    (sessionId: string, suggestionId: string, vote: Vote) => {
      backend
        .updateVote(sessionId, suggestionId, vote)
        .then((s) => setCurrentSession(s));
    },
    [backend.updateVote, setCurrentSession],
  );

  const appState = useMemo(() => {
    return {
      user,
      currentSession,
      inviteUser,
      addSuggestion,
      updateResponse,
      updateVote,
    };
  }, [user, currentSession]);
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}
