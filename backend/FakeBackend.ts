import { useState, useCallback } from "react";
import {
  Attending,
  Session,
  User,
  Vote,
  makeInvitation,
  makeSuggestion,
  makeUser,
} from "../provided/types";
import _ from "lodash";
import {
  replace,
  update,
  log,
  promiseDelay,
  push,
  removeId,
  addId,
} from "../provided/utils";
import {
  makeSelf,
  makeOwner,
  makeUsers,
  makeFakeSession,
  possiblyUpdateSession,
} from "./DataGen";
import { SessionWithUpdate } from "./DataGen";

interface FakeBackendMethods {
  fetchSelf: () => Promise<User>;
  fetchSession: () => Promise<Session>;
  inviteUser: (sessionId: string, name: string) => Promise<Session>;
  addSuggestion: (sessionId: string, name: string) => Promise<Session>;
  updateVote: (
    sessionId: string,
    suggestionId: string,
    vote: Vote,
  ) => Promise<Session>;
  updateResponse: (
    sessionId: string,
    accepted: boolean,
    attending: Attending,
  ) => Promise<Session>;
}

export function useFakeBackend(): FakeBackendMethods {
  const [self] = useState<User>(() => makeSelf());
  const [owner] = useState<User>(() => makeOwner());
  const [users] = useState<User[]>(() => makeUsers());
  const [currentSession, setCurrentSession] = useState<SessionWithUpdate>(
    () => ({
      session: makeFakeSession(owner, users),
      updates: {
        addedSuggestion: Date.now(),
        addedInvitation: Date.now(),
      },
    }),
  );

  const fetchSelf = useCallback((): Promise<User> => {
    return promiseDelay(Promise.resolve(self));
  }, [self]);

  const fetchSession = useCallback((): Promise<Session> => {
    return promiseDelay(
      new Promise((resolve) => {
        setCurrentSession(({ session, updates }) => {
          const [newSession, newUpdates] = possiblyUpdateSession(
            self,
            session,
            updates,
            users,
          );
          resolve(newSession);
          return {
            session: newSession,
            updates: newUpdates,
          };
        });
      }),
    );
  }, [currentSession]);

  const updateVote = useCallback(
    (sessionId: string, suggestionId: string, vote: Vote): Promise<Session> => {
      log(`Backend: Received vote update: ${suggestionId} ${vote}`);
      if (sessionId === currentSession.session.id) {
        return promiseDelay(
          new Promise((resolve) => {
            setCurrentSession(({ session, updates }) => {
              const newSuggestions = session.suggestions.map((s) => {
                if (s.id === suggestionId) {
                  // find the right suggestion
                  if (vote === "none") {
                    // remove from both lists
                    return {
                      ...s,
                      upVoteUserIds: removeId(s.upVoteUserIds, self.id),
                      downVoteUserIds: removeId(s.downVoteUserIds, self.id),
                    };
                  } else if (vote === "up") {
                    return {
                      ...s,
                      upVoteUserIds: addId(s.upVoteUserIds, self.id),
                      downVoteUserIds: removeId(s.downVoteUserIds, self.id),
                    };
                  } else if (vote === "down") {
                    return {
                      ...s,
                      upVoteUserIds: removeId(s.upVoteUserIds, self.id),
                      downVoteUserIds: addId(s.downVoteUserIds, self.id),
                    };
                  }
                } else {
                  return s;
                }
              });
              session = replace(session, "suggestions", newSuggestions);
              resolve(session);
              return { session, updates };
            });
          }),
        );
      } else {
        return promiseDelay(Promise.reject("Bad session ID"));
      }
    },
    [self],
  );

  const addSuggestion = useCallback(
    (sessionId: string, name: string): Promise<Session> => {
      log(`Backend: Received add suggestion: ${name}`);
      if (sessionId === currentSession.session.id) {
        return promiseDelay(
          new Promise((resolve) => {
            setCurrentSession(({ session, updates }) => {
              session = replace(
                session,
                "suggestions",
                push(session.suggestions, makeSuggestion({ name })),
              );
              resolve(session);
              return { session, updates };
            });
          }),
        );
      } else {
        return promiseDelay(Promise.reject("Bad session ID"));
      }
    },
    [self],
  );

  const inviteUser = useCallback(
    (sessionId: string, name: string): Promise<Session> => {
      log(`Backend: Received invite user: ${name}`);
      if (sessionId === currentSession.session.id) {
        return promiseDelay(
          new Promise((resolve) => {
            setCurrentSession(({ session, updates }) => {
              session = replace(
                session,
                "invitations",
                push(
                  session.invitations,
                  makeInvitation({ user: makeUser({ name }) }),
                ),
              );
              resolve(session);
              return { session, updates };
            });
          }),
        );
      } else {
        return promiseDelay(Promise.reject("Bad session ID"));
      }
    },
    [self],
  );

  const updateResponse = useCallback(
    (
      sessionId: string,
      accepted: boolean,
      attending: Attending,
    ): Promise<Session> => {
      log(`Backend: Received update response: ${accepted} ${attending}`);
      if (sessionId === currentSession.session.id) {
        return promiseDelay(
          new Promise((resolve) => {
            setCurrentSession(({ session, updates }) => {
              session = update(session, {
                accepted,
                attending,
              });
              resolve(session);
              return { session, updates };
            });
          }),
        );
      } else {
        return promiseDelay(Promise.reject("Bad session ID"));
      }
    },
    [self],
  );

  return {
    fetchSelf,
    fetchSession,
    inviteUser,
    addSuggestion,
    updateResponse,
    updateVote,
  };
}
