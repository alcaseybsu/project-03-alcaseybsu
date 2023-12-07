import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { commonStyles, theme } from './provided/styles.js'; 
import PropTypes from 'prop-types';

function SuggestionsScreen({ suggestions }) {
  return (
    <ScrollView style={commonStyles.suggestionsSection}>
      <Text style={{ color: theme.titleText, fontSize: 20, marginBottom: 10 }}>
        Suggestions List
      </Text>
      {suggestions.map((suggestion) => (
        <View key={suggestion.id} style={{ marginBottom: 10 }}>
          <Text style={{ color: theme.subTitleText }}>{suggestion.name}</Text>
          <Text style={{ color: theme.bodyText }}>
            Up Votes: {suggestion.upVoteUserIds.length}
          </Text>
          <Text style={{ color: theme.bodyText }}>
            Down Votes: {suggestion.downVoteUserIds.length}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

SuggestionsScreen.propTypes = {
    suggestions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        upVoteUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        downVoteUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
  };
  
export default SuggestionsScreen;
