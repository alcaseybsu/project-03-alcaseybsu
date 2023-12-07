// DetailsComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { makeSelf, makeOwner, makeUsers, makeFakeSession } from './yourBackendFile'; // replace with your actual file path

export default function DetailsComponent() {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    setUser(makeSelf());
    setOwner(makeOwner());
    setUsers(makeUsers());
    setSession(makeFakeSession(owner, users));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>User Details</Text>
        {/* Display user details here */}
      </View>
      <View style={{ flex: 1 }}>
        <Text>Session Details</Text>
        {/* Display session details here */}
      </View>
      <View style={{ flex: 1 }}>
        <Text>Suggestions Summary</Text>
        <ScrollView>
          {session?.suggestions.map((suggestion, index) => (
            <Text key={index}>{suggestion.name}</Text>
          ))}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Invitations</Text>
        <ScrollView></ScrollView>
        {session?.invitations.map((invitation, index) => (
            <Text key={index}>{invitation.user.name}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}