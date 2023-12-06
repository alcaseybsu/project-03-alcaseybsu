import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView } from 'react-native';
import { useAppContext } from './provided/AppContext';
import { commonStyles } from './provided/styles';

function SuggestionsList() {
  const { currentSession, addSuggestion, updateVote } = useAppContext();
  const [newSuggestion, setNewSuggestion] = useState('');
  const [votedSuggestions, setVotedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (currentSession) {
      const votedIds = currentSession.suggestions
        .filter(suggestion => suggestion.upVoteUserIds.includes(currentSession.owner?.id))
        .map(suggestion => suggestion.id);
      setVotedSuggestions(votedIds);
    }
  }, [currentSession]);

  const handleVote = (suggestionId: string) => {
    if (currentSession && updateVote) {
      updateVote(currentSession.id, suggestionId, 'up');
    }
  };

  const handleRemoveVote = (suggestionId: string) => {
    if (currentSession && updateVote) {
      updateVote(currentSession.id, suggestionId, 'none');
    }
  };

  const handleAddSuggestion = () => {
    if (currentSession && addSuggestion && newSuggestion.trim() !== '') {
      addSuggestion(currentSession.id, newSuggestion.trim());
      setNewSuggestion('');
    }
  };

  return (
    <View>
      <Text style={commonStyles.subTitle}>Suggestions</Text>
      <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.scrollContent}>
        {currentSession?.suggestions.map(suggestion => (
          <View key={suggestion.id} style={commonStyles.detailsView}>
            <Text style={commonStyles.listText}>{suggestion.name}</Text>
            <Text style={commonStyles.listText}>Votes: {suggestion.upVoteUserIds.length}</Text>
            <Button
              title="Vote"
              onPress={() => handleVote(suggestion.id)}
              disabled={votedSuggestions.includes(suggestion.id)}
            />
            <Button
              title="Remove Vote"
              onPress={() => handleRemoveVote(suggestion.id)}
              disabled={!votedSuggestions.includes(suggestion.id)}
            />
          </View>
        ))}
      </ScrollView>
      <View style={commonStyles.horzBar3} />
      <View style={commonStyles.detailsView}>
        <TextInput
          placeholder="Enter your suggestion"
          value={newSuggestion}
          onChangeText={text => setNewSuggestion(text)}
        />
        <Button title="Add Suggestion" onPress={handleAddSuggestion} />
      </View>
    </View>
  );
}

export default SuggestionsList;
