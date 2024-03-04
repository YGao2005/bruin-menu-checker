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
  today.setDate(today.getDate() - 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Maintain a set of printed meal periods for each day
  const [printedMealPeriods, setPrintedMealPeriods] = useState(new Set());

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
    setPrintedMealPeriods(new Set()); // Reset printed meal periods
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
      <div className="welcome-to-bruin-menu-checker-cK8" id="1:104">
       WELCOME TO
       <br />
       BRUIN MENU CHECKER
     </div>
     <div class="subtitle">
      Enter a menu item or keyword to find out which day and 
      <br />
      meal period UCLA dining halls serve it!

     </div>
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
                    printedMealPeriods={printedMealPeriods}
                    setPrintedMealPeriods={setPrintedMealPeriods} // Pass the setter function
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
