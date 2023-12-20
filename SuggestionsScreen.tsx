import React from 'react';
import { ScrollView } from 'react-native';
import SuggestionsList from './SuggestionsList'; 
import { commonStyles } from './provided/styles';

function SuggestionsPage() {
  return (
    <ScrollView style={commonStyles.scroll} contentContainerStyle={commonStyles.scrollContent}>
      <SuggestionsList />
    </ScrollView>
  );
}

export default SuggestionsPage;

