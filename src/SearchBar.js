import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './SearchBar.css';

function SearchBar({ suggestions, onSearchSubmit }) {
  const [value, setValue] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValueLowerCase)
    );
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestionsList(getSuggestions(value)); // Remove slicing to include all suggestions
  };

  const onSuggestionsClearRequested = () => {
    setSuggestionsList([]);
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    onSearchSubmit(suggestionValue);
    setValue('');
    setSuggestionsList([]);
  };

  const handleSubmit = () => {
    if (value.trim() !== '') {
      onSearchSubmit(value);
      setValue('');
      setSuggestionsList([]);
    }
  };

  const inputProps = {
    placeholder: 'Enter search term',
    value,
    onChange,
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        handleSubmit();
      }
    }
  };

  return (
    <div className="search-bar">
      <Autosuggest
        suggestions={suggestionsList}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <div>{suggestion}</div>}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        theme={{
          input: 'input-field',
          suggestionsContainer: 'react-autosuggest__suggestions-container',
          suggestionsList: 'react-autosuggest__suggestions-list',
          suggestion: 'suggestion',
          suggestionHighlighted: 'suggestion-highlighted' // Add this line to highlight suggestions
        }}
      />
      <div className="submit-button-background" onClick={handleSubmit}>
        <p className="enter-text">ENTER</p>
      </div>
    </div>
  );
}

export default SearchBar;
