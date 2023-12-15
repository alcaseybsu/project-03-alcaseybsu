import React, { useEffect, useState } from 'react';
import { useFakeBackend } from './backend/FakeBackend';
import _ from "lodash";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, SafeAreaView, View, ScrollView, Button, Modal, TouchableOpacity, TouchableHighlight } from "react-native";
import { commonStyles, theme } from "./provided/styles";
import { useAppContext } from "./provided/AppContext";
import { Session, User, Vote, Attending } from "./provided/types";

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

function SuggestionsList({ _suggestions, handleUpdateVote }: SuggestionsListProps & { handleUpdateVote: (suggestionId: string, voteType: 'up' | 'down') => void }) {
  let currentSession;
  try {
    currentSession = useAppContext().currentSession;
  } catch (error) {
    return <Text>Error: {(error as Error).message}</Text>;
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={commonStyles.subTitle}>Suggestions & Votes</Text>
      </View>
      <View>
        <Text style={commonStyles.listText}>Touch 👍 to Upvote, Touch 👎 to Downvote</Text>
      </View>
      <View style={commonStyles.horzBar3} />
      <ScrollView>
        {currentSession?.suggestions.map((item, index) => (
          <View key={item.id} style={[commonStyles.detailsView, { backgroundColor: index % 2 === 0 ? '#003f5c' : '#005974' }]}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[commonStyles.listText, { flex: 1 }]}>{item.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleUpdateVote(item.id, 'up')}>
                  <Text style={commonStyles.listText}>👍 {item.upVoteUserIds.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdateVote(item.id, 'down')}>
                  <Text style={commonStyles.listText}>👎 {item.downVoteUserIds.length}</Text>
                </TouchableOpacity>
              </View>
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

  const [currentScreen] = useState<'initial' | 'suggestions'>('initial');

  const renderMainContent = () => {
    if (currentScreen === 'initial') {
      return (
        <>
          {currentSession?.accepted && <UserDetails user={user} />}
          <SessionDetails session={currentSession} />
          {currentSession?.accepted && <SuggestionsList _suggestions={currentSession?.suggestions || []} handleUpdateVote={handleUpdateVote} />}
          {currentSession?.accepted && <InvitationsList invitations={currentSession?.invitations || []} />}
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

  const [inputUserId, setInputUserId] = useState<string>('');

  const handleInviteUser = async (UserId: string) => {
    modalVisible && setModalVisible(false);
    try {
      if (currentSession && contextInviteUser) {
        contextInviteUser(currentSession.id, UserId);
        setModalVisible(false);
      } else {
        console.error("Current session or contextInviteUser is not available.");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  const handleUpdateVote = (suggestionId: string, voteType: Vote): Promise<void> => {
    return new Promise((resolve, _reject) => {
      if (currentSession && updateVote) {
        const suggestion = currentSession.suggestions.find(s => s.id === suggestionId);
        if (suggestion) {
          updateVote(currentSession.id, suggestion.id, voteType);
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

  const handleUnacceptInvitation = async () => {
    try {
      if (currentSession && updateResponse) {
        const attendingStatus: Attending = 'no';
        updateResponse(currentSession.id, false, attendingStatus);
      } else {
        console.error("Current session or updateResponse is not available.");
      }
    } catch (error) {
      console.error("Error unaccepting invitation:", error);
    }
  };

  const [modalAction, setModalAction] = useState<'invite' | 'addSuggestion'>('invite');


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
          {currentSession?.accepted && (
            <Button title="Unaccept" onPress={handleUnacceptInvitation} disabled={!currentSession?.accepted} />
          )}
          <Button title="Respond" onPress={handleUpdateResponse} disabled={!currentSession?.accepted} />
          <Button title="Invite" onPress={() => setModalVisible(true)} disabled={!currentSession?.accepted} />

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
                  value={modalAction === 'invite' ? inputUserId : suggestionName}
                  onChangeText={modalAction === 'invite' ? setInputUserId : setSuggestionName}
                  placeholder={modalAction === 'invite' ? "First Name..." : "Suggestion..."}
                />
                <TouchableHighlight
                  style={{ ...commonStyles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    if (modalAction === 'invite') {
                      handleInviteUser(inputUserId);
                    } else if (modalAction === 'addSuggestion') {
                      handleAddSuggestion();
                    }
                    setModalVisible(false);
                    setInputUserId('');
                    setSuggestionName('');
                  }}
                >
                  <Text style={commonStyles.textStyle}>{modalAction === 'invite' ? 'Invite' : 'Done'}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <Button title="Add Suggestion" onPress={() => { setModalVisible(true); setModalAction('addSuggestion'); }} disabled={!currentSession?.accepted} />
        </View>
        <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.scrollContent}>
          {renderMainContent()}
          <StatusBar style="auto" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}