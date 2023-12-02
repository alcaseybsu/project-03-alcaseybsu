import _ from "lodash";
import { genid } from "../provided/genid";
import {
  User,
  makeUser,
  makeInvitation,
  Session,
  Invitation,
  Suggestion,
  ATTENDING,
  makeSuggestion,
} from "../provided/types";
import { choose, push, replace, log, removeId } from "../provided/utils";

import fakeData from "./FakeData.json";

export const makeSelf = (): User =>
  makeUser({
    name: "Myself",
  });
export const makeOwner = (): User =>
  makeUser({
    name: getRandom("firstNames"),
  });
export const makeUsers = (): User[] =>
  fakeData.firstNames.map((name) => makeUser({ name }));
export const makeFakeSession = (owner: User, users: User[]): Session => {
  const invitations: Invitation[] = [];
  invitations.push({
    user: getNewInvitation(invitations, users),
    accepted: true,
    attending: "yes",
  });
  invitations.push({
    user: getNewInvitation(invitations, users),
    accepted: false,
    attending: "undecided",
  });
  invitations.push({
    user: getNewInvitation(invitations, users),
    accepted: true,
    attending: "undecided",
  });
  invitations.push({
    user: getNewInvitation(invitations, users),
    accepted: true,
    attending: "no",
  });
  invitations.push({
    user: getNewInvitation(invitations, users),
    accepted: true,
    attending: "no",
  });

  const suggestions: Suggestion[] = [];

  suggestions.push({
    id: genid(),
    name: getNewSuggestion(suggestions),
    upVoteUserIds: [choose(invitations).user.id],
    downVoteUserIds: [],
  });

  suggestions.push({
    id: genid(),
    name: getNewSuggestion(suggestions),
    upVoteUserIds: [choose(invitations).user.id, choose(invitations).user.id],
    downVoteUserIds: [choose(invitations).user.id],
  });

  suggestions.push({
    id: genid(),
    name: getNewSuggestion(suggestions),
    upVoteUserIds: [choose(invitations).user.id],
    downVoteUserIds: [choose(invitations).user.id, choose(invitations).user.id],
  });

  suggestions.push({
    id: genid(),
    name: getNewSuggestion(suggestions),
    upVoteUserIds: [],
    downVoteUserIds: [],
  });

  return {
    id: genid(),
    owner,
    description: "Watch one of the best movies of all time.",
    accepted: false,
    attending: "undecided",
    invitations,
    suggestions,
  };
};

export function getRandom(field: keyof typeof fakeData): string {
  return fakeData[field][_.random(fakeData[field].length - 1)];
}

function getNewUser(userIds: string[], users: User[]): User | undefined {
  if (users.length == 0) {
    return undefined;
  }
  const MAX_LOOPS = 1000;
  for (const _i of _.range(MAX_LOOPS)) {
    const user = choose(users);
    if (!userIds.find((id) => id === user.id)) {
      return user;
    }
  }
  // if we can't find a unique user after 1000 draws, give up
  return undefined;
}

export function getNewInvitation(
  invitations: Invitation[],
  users: User[],
): User {
  const newUser = getNewUser(_.map(invitations, "id"), users);
  if (newUser) {
    return newUser;
  } else {
    return makeUser({
      name: getRandom("firstNames"),
    });
  }
}

export function getNewSuggestion(suggestions: Suggestion[]): string {
  const MAX_LOOPS = 1000;
  for (const _i of _.range(MAX_LOOPS)) {
    const movie = getRandom("movies");
    if (!suggestions.find((s) => s.name === movie)) {
      return movie;
    }
  }
  // if we can't find a unique movie after 1000 draws, then just
  // return a random one
  return getRandom("movies");
}

export function possiblyUpdateSession(
  user: User,
  session: Session,
  updates: SessionUpdates,
  users: User[],
): [Session, SessionUpdates] {
  // update votes
  const acceptedUsers = _.map(
    session.invitations.filter((i) => i.accepted),
    "user",
  );

  const updatedSuggestions: Suggestion[] = [];
  for (const s of session.suggestions) {
    if (Math.random() > 0.8) {
      if (Math.random() > 0.5 && s.upVoteUserIds.length > 0) {
        const userId = choose(s.upVoteUserIds);
        if (userId && userId !== user.id) {
          // log(`Remove upvote for ${s.name} by ${userId}`);
          s.upVoteUserIds = removeId(s.upVoteUserIds, userId);
        }
      } else {
        const newUser = getNewUser(s.upVoteUserIds, acceptedUsers);
        if (newUser) {
          // log(`Add upvote for ${s.name} by ${newUser.id}`);
          s.upVoteUserIds.push(newUser.id);
        }
      }
    }

    if (Math.random() > 0.8) {
      if (Math.random() > 0.5 && s.downVoteUserIds.length > 0) {
        const userId = choose(s.downVoteUserIds);
        if (userId && userId !== user.id) {
          // log(`Remove downvote for ${s.name} by ${userId}`);
          s.downVoteUserIds = removeId(s.downVoteUserIds, userId);
        }
      } else {
        const newUser = getNewUser(s.downVoteUserIds, acceptedUsers);
        if (newUser) {
          // log(`Add downvote for ${s.name} by ${newUser.id}`);
          s.downVoteUserIds.push(newUser.id);
        }
      }
    }
    updatedSuggestions.push(_.cloneDeep(s));
  }
  session = replace(session, "suggestions", updatedSuggestions);

  // update response and attending
  const updatedInvitations: Invitation[] = [];
  for (const i of session.invitations) {
    if (Math.random() > 0.8) {
      if (i.accepted) {
        if (Math.random() > 0.95) {
          i.accepted = false;
        } else {
          i.attending = choose(ATTENDING);
        }
      } else {
        i.accepted = true;
      }
    }
    updatedInvitations.push(i);
  }
  session = replace(session, "invitations", updatedInvitations);

  // rarely invite a new user
  const addInviteProb =
    (Date.now() - updates.addedInvitation) /
    (100_000 * session.invitations.length ** 2);
  // log(`      Invite probablity: ${addInviteProb.toFixed(4)}`);
  if (Math.random() < addInviteProb) {
    updates.addedInvitation = Date.now();
    const newUser = getNewInvitation(session.invitations, users);
    if (newUser) {
      log(`Inviting a new user: ${newUser.name}`);
      session = replace(
        session,
        "invitations",
        push(
          session.invitations,
          makeInvitation({
            accepted: Math.random() > 0.5,
            attending:
              Math.random() > 0.7
                ? "yes"
                : Math.random() > 0.7
                ? "no"
                : "undecided",
            user: newUser,
          }),
        ),
      );
    }
  }

  // rarely add a new suggestion
  const addSessProb =
    (Date.now() - updates.addedSuggestion) /
    (100_000 * session.suggestions.length ** 2);
  // log(`      Add suggestion probability: ${addSessProb.toFixed(4)}`);
  if (Math.random() < addSessProb) {
    updates.addedSuggestion = Date.now();
    const newSuggestion = makeSuggestion({
      name: getNewSuggestion(session.suggestions),
    });
    log(`Adding a new suggestion: ${newSuggestion.name}`);
    session = replace(
      session,
      "suggestions",
      push(session.suggestions, newSuggestion),
    );
  }
  return [session, updates];
} // Track how long ago the session was updated

export interface SessionUpdates {
  addedSuggestion: number;
  addedInvitation: number;
}

export interface SessionWithUpdate {
  session: Session;
  updates: SessionUpdates;
}
