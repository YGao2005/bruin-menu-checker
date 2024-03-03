import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './SearchBar.css'; // Import the CSS file for styling

function SearchBar({ suggestions, onSearchTermChange, onSearchSubmit }) {
  const [value, setValue] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.trim().toLowerCase();
    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValueLowerCase)
    );
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestionsList(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestionsList([]);
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion;
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      onSearchSubmit(value); // Trigger search submission
      setValue(''); // Clear input field after submission
    }
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault(); // Prevent form submission
    onSearchSubmit(suggestionValue); // Trigger search submission
    setValue(''); // Clear input field after submission
  };

  return (
    <div className="search-bar">
      <Autosuggest
        suggestions={suggestionsList}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={(suggestion) => <div>{suggestion}</div>}
        inputProps={{
          placeholder: 'Enter search term',
          value,
          onChange,
          onKeyDown,
        }}
        onSuggestionSelected={onSuggestionSelected}
      />
    </div>
  );
}

export default SearchBar;
