import React, { useState } from 'react';
import SearchBar from './SearchBar';
import MenuChecker from './MenuChecker';
import menuItems from './menuItems.json';
import './App.css';

function App() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Accumulate menu items from JSON into an array
  const suggestions = [];
  Object.values(menuItems).forEach(venue => {
    venue.categories.forEach(category => {
      suggestions.push(...category.items);
    });
  });

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerms([newSearchTerm]);
  };

  const handleSearchSubmit = (submittedTerm) => {
    setSearchTerms(prevSearchTerms => [...prevSearchTerms, submittedTerm]);
    setSearchSubmitted(true);
  };

  const handleClear = () => {
    setSearchTerms([]);
    setSearchSubmitted(false);
  };

  const generateDatesForNextWeek = () => {
    const dates = [];
    const currentDate = new Date(today.getTime());
    while (currentDate <= nextWeek) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const datesForNextWeek = generateDatesForNextWeek();

  return (
    <div className="App">
      <h1 class="website-title">Menu Checker</h1>
      <SearchBar suggestions={suggestions} onSearchTermChange={handleSearchTermChange} onSearchSubmit={handleSearchSubmit} />
      {searchSubmitted && (
        <div>

    
          <div className="clear-button" onClick={handleClear}>
            CLEAR
          </div>

          {datesForNextWeek.map((date, dateIndex) => (
            <div key={dateIndex}>
              <div class="title-box">
              <h2 class="date-title">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
              </div>
              <div class="meals-body">
              <div class="title-padding"></div>
              {mealTypes.map((mealType, mealIndex) => (
                <MenuChecker
                  key={`${dateIndex}-${mealType}`}
                  searchTerms={searchTerms}
                  mealType={mealType}
                  date={date.toISOString().split('T')[0]}
                />
              ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
