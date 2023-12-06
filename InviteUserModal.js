// InviteUserModal.js
import React, { useState } from 'react';
import { View, TextInput, Button, Modal } from 'react-native';

const InviteUserModal = ({ isVisible, onClose, onInvite }) => {
  const [invitee, setInvitee] = useState('');

  const handleInvite = () => {
    onInvite(invitee);
    setInvitee('');
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View>
        <TextInput
          placeholder="Enter the name of the friend to invite"
          value={invitee}
          onChangeText={setInvitee}
        />
        <Button title="Invite" onPress={handleInvite} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default InviteUserModal;
