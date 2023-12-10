import React, { useEffect, useState } from 'react';
import { useFakeBackend } from './backend/FakeBackend';
import _ from "lodash";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, SafeAreaView, View, ScrollView, Button, GestureResponderEvent, TouchableOpacity, Modal, TouchableHighlight } from "react-native";
import { commonStyles, theme } from "./provided/styles";
import { useAppContext } from "./provided/AppContext";
import { Session, User, VOTES, nextAttending, Attending } from "./provided/types";
import { choose } from "./provided/utils";


function UserDetails({ user }: { user?: User }) {
  return (
    <>
      <Text style={commonStyles.subTitle}>User Details</Text>
      <View style={commonStyles.horzBar2} />
      <View style={commonStyles.detailsView}>
        {user ? (
          <>
            <Text style={commonStyles.listText}>Your User ID: {user.id}</Text>
            <Text style={commonStyles.listText}>Your User Name: {user.name}</Text>
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
            <Text style={commonStyles.listText}>Session ID: {session.id}</Text>
            <Text style={commonStyles.listText}>Owner: {session.owner.name}</Text>
            <Text style={commonStyles.listText}>
              Description: {session.description}
            </Text>

            <Text style={commonStyles.listText}>
              Your acceptance: {session.accepted ? "true" : "false"}
            </Text>
            <Text style={commonStyles.listText}>
              Your response: {session.attending}
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

interface SuggestionsListProps {
  _suggestions: Session["suggestions"];
}

function SuggestionsList({ _suggestions }: SuggestionsListProps) {
  const { currentSession } = useAppContext();
  return (
    <View>
      <Text style={commonStyles.subTitle}>Suggestions & Votes</Text>
      <View style={commonStyles.horzBar3} />
      <ScrollView>
        {currentSession?.suggestions.map((item, index) => (
          <View key={item.id} style={[commonStyles.detailsView, { backgroundColor: index % 2 === 0 ? '#003f5c' : '#005974' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[commonStyles.listText, { flex: 1 }]}>{item.name}</Text>
              <Text style={commonStyles.listText}>👍 {item.upVoteUserIds.length}  👎 {item.downVoteUserIds.length}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={commonStyles.horzBar3} />
    </View>
  );
}

interface InvitationsListProps {
  invitations: Session["invitations"];
}

function InvitationsList({ invitations }: InvitationsListProps) {
  return (
    <View>
      <Text style={commonStyles.subTitle}>Invitations</Text>
      <Text style={commonStyles.listText}>💌 = Accepted Status ✅ = Attending Status</Text>
      <View style={commonStyles.horzBar3} />
      <ScrollView>
        {invitations.map((item, index) => (
          <View key={item.user.id} style={[commonStyles.detailsView, { backgroundColor: index % 2 === 0 ? '#003f5c' : '#005974' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={commonStyles.listText}>{item.user.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200 }}>
                <Text style={commonStyles.listText}>💌  {item.accepted ? 'Y' : 'N'}</Text>
                <Text style={commonStyles.listText}>✅  {item.attending}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={commonStyles.horzBar3} />
    </View>
  );
}


export default function Project3App() {
  const backend = useFakeBackend();
  const [modalVisible, setModalVisible] = useState(false);
  


  useEffect(() => {
    backend.fetchSelf().then((user) => {
      console.log(user);
    });
  }, []);

  const {
    user,
    currentSession,
    addSuggestion,
    inviteUser: contextInviteUser,
    updateResponse,
    updateVote,
  } = useAppContext();

  const [currentScreen, setCurrentScreen] = useState<'initial' | 'suggestions'>('initial');


  const navigateToInitial = () => {
    setCurrentScreen('initial');
  };

  const renderMainContent = () => {
    if (currentScreen === 'suggestions') {
      return (
        <>
          <TouchableOpacity onPress={navigateToInitial} style={commonStyles.goBackButton}>
            <Text style={commonStyles.listText}>Go Back to Initial Screen</Text>
          </TouchableOpacity>

        </>
      );
    } else {
      return (
        <>
          {currentSession?.accepted && <UserDetails user={user} />}
          <SessionDetails session={currentSession} />
          <View style={commonStyles.horzBar3} />
          <Text style={commonStyles.listText}></Text>
          <SuggestionsList _suggestions={currentSession?.suggestions || []} />
          <InvitationsList invitations={currentSession?.invitations || []} />
        </>
      );
    }
  };

  const [suggestionName, setSuggestionName] = useState('');

  const handleAddSuggestion = async () => {
    modalVisible && setModalVisible(false);
    try {
      if (currentSession && addSuggestion) {
        addSuggestion(currentSession.id, suggestionName);
        setModalVisible(false);
      } else {
        console.error("Current session or addSuggestion is not available.");
      }
    } catch (error) {
      console.error("Error adding suggestion:", error);
    }
  };


  const handleInviteUser = (_event: GestureResponderEvent) => {
    if (currentSession && contextInviteUser) {
      // user input eventually?
      const newInviteeName = "New Invitee";
      contextInviteUser(currentSession.id, newInviteeName);
    } else {
      console.error("Invalid invitation input");
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
      let newAttendingStatus: Attending;

      // Toggle between "Yes," "No," and "Undecided"
      switch (currentSession.attending) {
        case 'yes':
          newAttendingStatus = 'no';
          break;
        case 'no':
          newAttendingStatus = 'undecided';
          break;
        default:
          newAttendingStatus = 'yes';
      }

      updateResponse(currentSession.id, true, newAttendingStatus);
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
        <Text style={{ ...commonStyles.title, color: theme.titleText }}>In Decision</Text>
        <View style={commonStyles.horzBar} />
        <Text style={{ ...commonStyles.bodyText, color: theme.bodyText }}>Make Up Our Mind</Text>
        <View style={commonStyles.horzBar} />
        <View style={commonStyles.buttonContainer}>
          {!currentSession?.accepted && (
            <Button title="Accept" onPress={handleAcceptInvitation} disabled={currentSession?.accepted} />
          )}
          <Button title="Respond" onPress={handleUpdateResponse} disabled={!currentSession?.accepted} />
          <Button title="Invite" onPress={handleInviteUser} disabled={!currentSession?.accepted} />
          <Button title="Vote" onPress={handleUpdateVote} disabled={!currentSession?.accepted} />
        </View>
        {/* User input components */}
        <View>
        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
  }}
>
  <View style={commonStyles.centeredView}>
    <View style={commonStyles.modalView}>
      <TextInput
        value={suggestionName}
        onChangeText={setSuggestionName}
        placeholder="Add suggestion..."
      />

      <TouchableHighlight
        style={{ ...commonStyles.openButton, backgroundColor: "#2196F3" }}
        onPress={() => {
          handleAddSuggestion();
          setModalVisible(false);
          setSuggestionName('');
        }}
      >
        <Text style={commonStyles.textStyle}>DONE</Text>
      </TouchableHighlight>
    </View>
  </View>
</Modal>

<Button title="Add Suggestion" onPress={() => setModalVisible(true)} disabled={!currentSession?.accepted} />
        </View>
        <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.scrollContent}>
          {renderMainContent()}
          <StatusBar style="auto" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}