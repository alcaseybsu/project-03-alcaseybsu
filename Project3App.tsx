import React, { useState } from 'react';
import _ from "lodash";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, SafeAreaView, View, ScrollView, Button, Modal } from "react-native";
import { commonStyles } from "./provided/styles";
import { useAppContext } from "./provided/AppContext";
import { Session, User, VOTES, nextAttending } from "./provided/types";
import { choose } from "./provided/utils";
import { Attending } from './provided/types';

function UserDetails({ user }: { user?: User }) {
  return (
    <>
      <Text style={commonStyles.subTitle}>User Details</Text>
      <View style={commonStyles.horzBar2} />
      <View style={commonStyles.detailsView}>
        {user ? (
          <>
            <Text style={commonStyles.listText}>- Your User ID: {user.id}</Text>
            <Text style={commonStyles.listText}>- Your User Name: {user.name}</Text>
          </>
        ) : (
          <Text style={commonStyles.listText}>loading...</Text>
        )}
      </View>
      <View style={commonStyles.horzBar2} />
    </>
  );
}

function SessionDetails({ session }: { session?: Session }) {
  return (
    <>
      <Text style={commonStyles.subTitle}>Session Details</Text>
      <View style={commonStyles.horzBar2} />
      <View style={commonStyles.detailsView}>
        {session ? (
          <>
            <Text style={commonStyles.listText}>- Session ID: {session.id}</Text>
            <Text style={commonStyles.listText}>- Owner: {session.owner.name}</Text>
            <Text style={commonStyles.listText}>
              - Description: {session.description}
            </Text>
            <Text style={commonStyles.listText}>
              - Your acceptance: {session.accepted ? "true" : "false"}
            </Text>
            <Text style={commonStyles.listText}>
              - Your response: {session.attending}
            </Text>
          </>
        ) : (
          <Text style={commonStyles.listText}>loading...</Text>
        )}
      </View>
      <View style={commonStyles.horzBar2} />
    </>
  );
}

function InvitationsSummary({ session }: { session?: Session }) {
  const { inviteUser } = useAppContext();
  const [inviteeName, setInviteeName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleInvite = () => {
    if (session && inviteUser && inviteeName.trim() !== '') {
      inviteUser(session.id, inviteeName.trim());
      hideModal();
    }
  };
  return (
    <>
      <Text style={commonStyles.subTitle}>Invitations Summary</Text>
      <View style={commonStyles.horzBar3} />
      <View style={commonStyles.detailsView}>
        {session ? (
          <>
            <Text style={commonStyles.listText}>
              - Invitations sent: {session.invitations.length}
            </Text>
            <Text style={commonStyles.listText}>
              - Invitations accepted:{' '}
              {session.invitations.filter((i) => i.accepted).length}
            </Text>
            <Text style={commonStyles.listText}>
              - Attending:{' '}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === 'yes',
                ).length
              }
            </Text>
            <Text style={commonStyles.listText}>
              - Undecided:{' '}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === 'undecided',
                ).length
              }
            </Text>
            <Text style={commonStyles.listText}>
              - Not attending:{' '}
              {
                session.invitations.filter(
                  (i) => i.accepted && i.attending === 'no',
                ).length
              }
            </Text>
            <Button title="Invite" onPress={showModal} />
          </>
        ) : (
          <Text style={commonStyles.listText}>loading...</Text>
        )}
      </View>
      <View style={commonStyles.horzBar3} />

      {/* Modal for Invite */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Enter the name of the friend to invite:</Text>
            <TextInput
              placeholder="Friend's name"
              value={inviteeName}
              onChangeText={(text) => setInviteeName(text)}
            />
            <Button title="Invite" onPress={handleInvite} />
            <Button title="Cancel" onPress={hideModal} />
          </View>
        </View>
      </Modal>
    </>
  );
}

function SuggestionsSummary({ session }: { session?: Session }) {
  return (
    <>
      <Text style={commonStyles.subTitle}>Suggestions Summary</Text>
      <View style={commonStyles.horzBar3} />
      <View style={commonStyles.detailsView}>
        {session ? (
          <>
            <Text style={commonStyles.listText}>
              - Suggestions: {session.suggestions.length}
            </Text>
            <Text style={commonStyles.listText}>
              - Total up votes:{" "}
              {_.sum(session.suggestions.map((s) => s.upVoteUserIds.length))}
            </Text>
            <Text style={commonStyles.listText}>
              - Total down votes:{" "}
              {_.sum(session.suggestions.map((s) => s.downVoteUserIds.length))}
            </Text>
          </>
        ) : (
          <Text style={commonStyles.listText}>loading...</Text>
        )}
      </View>
      <View style={commonStyles.horzBar3} />
    </>
  );
}



export default function Project3App() {
  const {
    user,
    currentSession,
    addSuggestion,
    inviteUser,
    updateResponse,
    updateVote,
  } = useAppContext();

  const [newSuggestion, setNewSuggestion] = useState("");

  const handleAddSuggestion = async () => {
    try {
      if (currentSession && addSuggestion) {
        // choose a suggestion or get user input
        const newSuggestion = "New Suggestion";
        addSuggestion(currentSession.id, newSuggestion);

      } else {
        // handle when currentSession or addSuggestion not available
        console.error("Current session or addSuggestion is not available.");
      }
    } catch (error) {
      console.error("Error adding suggestion:", error);
    }
  };


  const handleInviteUser = () => {
    if (currentSession && inviteUser) {
      const invitee = window.prompt("Enter the name of the friend to invite:");

      if (invitee) {
        // call inviteUser with session ID and invitee name
        inviteUser(currentSession.id, invitee);
      } else {
        // handle case when user cancels or enters empty name
        console.log("Invitation canceled or invalid name entered.");
      }
    }
  };

  const handleUpdateVote = (): Promise<void> => {
    return new Promise((resolve, _reject) => {
      if (currentSession && updateVote) {
        const suggestion = choose(currentSession.suggestions);
        if (suggestion) {
          updateVote(currentSession.id, suggestion.id, choose(VOTES));
          if (updateResponse) {
            updateResponse(
              currentSession.id,
              true,
              nextAttending(currentSession.attending)
            );
          }
          resolve();
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  };


  const handleUpdateResponse = () => {
    if (currentSession && updateResponse) {
      const newAttendingStatus = nextAttending(currentSession.attending);

      updateResponse(currentSession.id, !currentSession.accepted, newAttendingStatus);
    }
  };







  const handleAcceptInvitation = async () => {
    try {
      if (currentSession && updateResponse) {
        const attendingStatus: Attending = 'yes';

        updateResponse(currentSession.id, true, attendingStatus);
      } else {        
        console.error("Current session or updateResponse is not available.");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);      
    }
  };

  return (
    <SafeAreaView style={commonStyles.app}>
      <View style={commonStyles.appContainer}>
        <Text style={commonStyles.title}>Project 3</Text>
        <View style={commonStyles.horzBar} />
        <Text style={commonStyles.bodyText}>
          Make Up Our Hive Mind
        </Text>
        <View style={commonStyles.horzBar} />
        <View style={commonStyles.buttonContainer}>
          {!currentSession?.accepted && (
            <Button title="Accept" onPress={handleAcceptInvitation} />
          )}
          <Button title="Respond" onPress={handleUpdateResponse} />
          <Button title="Suggest" onPress={handleAddSuggestion} />
          <Button title="Invite" onPress={handleInviteUser} />
          <Button title="Vote" onPress={handleUpdateVote} />
        </View>
        {/* User input components */}
        <View>
          <TextInput
            placeholder="Enter suggestion"
            value={newSuggestion}
            onChangeText={(text) => setNewSuggestion(text)}
          />
          <Button title="Add Suggestion" onPress={handleAddSuggestion} />
        </View>
        <ScrollView
          style={commonStyles.scroll}
          contentContainerStyle={commonStyles.scrollContent}
        >
          {currentSession?.accepted && <UserDetails user={user} />}
          <SessionDetails session={currentSession} />
          <SuggestionsSummary session={currentSession} />
          <InvitationsSummary session={currentSession} />
          <StatusBar style="auto" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
