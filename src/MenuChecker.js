import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import './MenuChecker.css'; // Import the CSS file for styling

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function MenuChecker({ searchTerms, mealType, date, printedMealPeriods }) {
    const [restaurants, setRestaurants] = useState([]);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1); // Calculate the next day's date

    useEffect(() => {
        async function fetchMenus() {
            try {
                const response = await axios.get(`https://menu.dining.ucla.edu/Menus/${date}/${mealType}`);
                const $ = cheerio.load(response.data);

                const restaurantMenus = [];
                $('.menu-block.half-col, .menu-block.third-col').each((index, element) => {
                    const restaurantName = $(element).find('h3.col-header').text();
                    const menuItems = [];
                    $(element).find('ul.item-list li.menu-item').each((index, item) => {
                        const menuItemText = $(item).find('span.tooltip-target-wrapper').text().trim();
                        const foundItems = searchTerms.filter(term => menuItemText.toLowerCase().includes(term.toLowerCase()));
                        if (foundItems.length > 0) {
                            menuItems.push(menuItemText);
                        }
                    });
                    if (menuItems.length > 0) { // Only add restaurant if menu items found
                        restaurantMenus.push({ name: restaurantName, items: menuItems });
                    }
                });

                setRestaurants(restaurantMenus);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchMenus();
    }, [searchTerms, mealType, date]);

    // Check if the meal period for the current day has already been printed
    const mealPeriodAlreadyPrinted = printedMealPeriods.has(mealType);

    return (
        <div className="table-container">
            {restaurants.length > 0 && (
                <div className="table">
                    {!mealPeriodAlreadyPrinted && <div className="meal-period">{mealType}</div>}
                    {restaurants.map((restaurant, index) => (
                        <React.Fragment key={index}>
                            <div className='restaurant-container'><div className={`restaurant ${getRestaurantColor(restaurant.name)}`}>{restaurant.name}</div></div>
                            <div className='menu-item-container'>
                            {restaurant.items.map((item, idx) => (
                                <div className="menu-item" key={idx}>{item}</div>
                            ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}

function getRestaurantColor(name) {
    switch (name) {
        case 'Bruin Plate':
            return 'green';
        case 'De Neve':
            return 'red';
        case 'Epicuria':
            return 'purple';
        default:
            return '';
    }
}

export default MenuChecker;
