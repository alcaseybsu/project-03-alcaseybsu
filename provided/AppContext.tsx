import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Attending, Session, User, Vote } from "./types";

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

const AppContext = createContext<AppState | undefined>(undefined);

export function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
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
  const [accessToken, setAccessToken] = useState<string>();

  const clientId = "leah";
  const clientSecret = "fdb5f2e0ba5675b56aebcc40";
  const URL = "http://cs411.duckdns.org";

  useEffect(() => {
    // fetch token
    fetch(`${URL}/token`, {
      method: "POST",
      body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Error fetching token");
      })
      .then((auth) => {
        setAccessToken(auth.access_token);

        // fetch self
        return fetch(`${URL}/self`, {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${auth.access_token}`,
          }),
        });
      })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Error fetching self");
      })
      .then((self) => {
        setUser(self);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  
  useEffect(() => {
    if (!pauseUpdates) {
      const interval = setInterval(() => {
        // fetch session
        fetch(`${URL}/session`, {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        })
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error("Error fetching session");
          })
          .then((session) => setCurrentSession(session))
          .catch((error) => console.error("Error:", error));
      }, refreshInterval ?? REFRESH_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    }
  }, [accessToken, setCurrentSession, pauseUpdates, refreshInterval]);
  
  const addSuggestion = useCallback(
    (sessionId: string, name: string) => {
      // fetch suggestion
      fetch(`${URL}/session/${sessionId}/suggestion`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Error adding suggestion");
        })
        .then((s) => setCurrentSession(s))
        .catch((error) => console.error("Error:", error));
    },
    [accessToken, setCurrentSession],
  );

  const inviteUser = useCallback(
    (sessionId: string, name: string) => {      
      fetch(`${URL}/session/${sessionId}/invite`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Error inviting user");
        })
        .then((s) => setCurrentSession(s))
        .catch((error) => console.error("Error:", error));
    },
    [accessToken, setCurrentSession],
  );
  
  const updateResponse = useCallback(
    (sessionId: string, accepted: boolean, attending: Attending) => {
      fetch(`${URL}/session/${sessionId}/response`, {
        method: "POST",
        body: JSON.stringify({ accepted, attending }),
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Error updating response");
        })
        .then((s) => setCurrentSession(s))
        .catch((error) => console.error("Error:", error));
    },
    [accessToken, setCurrentSession],
  );
  
  const updateVote = useCallback(
    (sessionId: string, suggestionId: string, vote: Vote) => {
      fetch(`${URL}/session/${sessionId}/suggestion/${suggestionId}/vote`, {
        method: "POST",
        body: JSON.stringify({ vote }),
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Error updating vote");
        })
        .then((s) => setCurrentSession(s))
        .catch((error) => console.error("Error:", error));
    },
    [accessToken, setCurrentSession],
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
