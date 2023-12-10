import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Button,
} from "react-native";
import { useAppContext } from "./AppContext";
import { Session, User, VOTES, nextAttending } from "./types";
import _ from "lodash";
import { choose } from "./utils";

/**
 * This is a demo of how to use the AppContext properly.
 * You may use this as a reference for your P3 Solution.
 */
function UserDetails({ user }: { user?: User }) {
  return (
    <>
      <Text style={styles.subTitle}>User Details</Text>
      <View style={styles.horzBar2} />
      <View style={styles.detailsView}>
        {user ? (
          <>
            <Text style={styles.listText}>- Your User ID: {user.id}</Text>
            <Text style={styles.listText}>- Your User Name: {user.name}</Text>
          </>
        ) : (
          <Text style={styles.listText}>loading...</Text>
        )}
      </View>
      <View style={styles.horzBar2} />
    </>
  );
}
function SessionDetails({ session }: { session?: Session }) {
  return (
    <>
      <Text style={styles.subTitle}>Session Details</Text>
      <View style={styles.horzBar2} />
      <View style={styles.detailsView}>
        {session ? (
          <>
            <Text style={styles.listText}>- Session ID: {session.id}</Text>
            <Text style={styles.listText}>- Owner: {session.owner.name}</Text>
            <Text style={styles.listText}>
              - Description: {session.description}
            </Text>
            <Text style={styles.listText}>
              - Your acceptance: {session.accepted ? "true" : "false"}
            </Text>
            <Text style={styles.listText}>
              - Your response: {session.attending}
            </Text>
          </>
        ) : (
          <Text style={styles.listText}>loading...</Text>
        )}
      </View>
      <View style={styles.horzBar2} />
    </>
  );
}
function InvitationsSummary({ session }: { session?: Session }) {
  return (
    <>
      <Text style={styles.subTitle}>Invitations Summary</Text>
      <View style={styles.horzBar3} />
      <View style={styles.detailsView}>
        {session ? (
          <>
            <Text style={styles.listText}>
              - Invitations sent: {session.invitations.length}
            </Text>
            <Text style={styles.listText}>
              - Invitations accepted:{" "}
              {session.invitations.filter((i) => i.accepted).length}
            </Text>
            <Text style={styles.listText}>
              - Attending:{" "}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === "yes",
                ).length
              }
            </Text>
            <Text style={styles.listText}>
              - Undecided:{" "}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === "undecided",
                ).length
              }
            </Text>
            <Text style={styles.listText}>
              - Not attending:{" "}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === "no",
                ).length
              }
            </Text>
          </>
        ) : (
          <Text style={styles.listText}>loading...</Text>
        )}
      </View>
      <View style={styles.horzBar3} />
    </>
  );
}
function SuggestionsSummary({ session }: { session?: Session }) {
  return (
    <>
      <Text style={styles.subTitle}>Suggestions Summary</Text>
      <View style={styles.horzBar3} />
      <View style={styles.detailsView}>
        {session ? (
          <>
            <Text style={styles.listText}>
              - Suggestions: {session.suggestions.length}
            </Text>
            <Text style={styles.listText}>
              - Total up votes:{" "}
              {_.sum(session.suggestions.map((s) => s.upVoteUserIds.length))}
            </Text>
            <Text style={styles.listText}>
              - Total down votes:{" "}
              {_.sum(session.suggestions.map((s) => s.downVoteUserIds.length))}
            </Text>
          </>
        ) : (
          <Text style={styles.listText}>loading...</Text>
        )}
      </View>
      <View style={styles.horzBar3} />
    </>
  );
}
export default function DemoSummary() {
  const {
    user,
    currentSession,
    addSuggestion,
    inviteUser,
    updateResponse,
    updateVote,
  } = useAppContext();

  const handleAddSuggestion = () => {
    // implement this properly
    if (currentSession && addSuggestion) {
      addSuggestion(currentSession.id, "A new suggestion");
    }
  };

  const handleInviteUser = () => {
    // implement this properly
    if (currentSession && inviteUser) {
      inviteUser(currentSession.id, "Molly");
    }
  };

  const handleUpdateVote = () => {
    // implement this properly
    if (currentSession && updateVote) {
      const suggestion = choose(currentSession.suggestions);
      if (suggestion) {
        updateVote(currentSession.id, suggestion.id, choose(VOTES));
      }
    }
  };

  const handleUpdateResponse = () => {
    // implement this properly
    if (currentSession && updateResponse) {
      updateResponse(
        currentSession.id,
        !currentSession.accepted,
        nextAttending(currentSession.attending),
      );
    }
  };
  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.appContainer}>
        <Text style={styles.title}>Project 3</Text>
        <View style={styles.horzBar} />
        <Text style={styles.bodyText}>
          Implement your solution to Project 3 here.
        </Text>
        <View style={styles.horzBar} />
        <View style={styles.buttonContainer}>
          <Button title="Respond" onPress={handleUpdateResponse} />
          <Button title="Suggest" onPress={handleAddSuggestion} />
          <Button title="Invite" onPress={handleInviteUser} />
          <Button title="Vote" onPress={handleUpdateVote} />
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <UserDetails user={user} />
          <SessionDetails session={currentSession} />
          <SuggestionsSummary session={currentSession} />
          <InvitationsSummary session={currentSession} />
          <StatusBar style="auto" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const theme = {
  dark1: "#003f5c",
  dark2: "#58508d",
  highlight1: "#bc5090",
  highlight2: "#ff6361",
  highlight3: "#ffa600",
  titleText: "#f0f0f0",
  subTitleText: "#f0f0f0",
  bodyText: "#d8d8d8",
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
  detailsView: {
    paddingLeft: 20,
    width: "80%",
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  horzBar: {
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "100%",
    backgroundColor: theme.highlight3,
  },
  horzBar2: {
    marginLeft: 10,
    marginRight: 10,
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "90%",
    backgroundColor: theme.highlight2,
  },
  horzBar3: {
    marginLeft: 10,
    marginRight: 10,
    height: 3,
    borderRadius: 1,
    marginVertical: 10,
    width: "90%",
    backgroundColor: theme.highlight1,
  },
  listText: {
    fontSize: 16,
    color: theme.bodyText,
    alignSelf: "flex-start",
  },
  bodyText: {
    fontSize: 16,
    color: theme.bodyText,
  },
  subTitle: {
    fontSize: 26,
    alignSelf: "flex-start",
    color: theme.subTitleText,
    paddingTop: 10,
  },
  title: {
    fontSize: 40,
    color: theme.titleText,
  },
  appContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
  },
  app: {
    flex: 1,
    paddingTop: 35,
    paddingBottom: 20,
    backgroundColor: theme.dark1,
    alignItems: "center",
  },
});
