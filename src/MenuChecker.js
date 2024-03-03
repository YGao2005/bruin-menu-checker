import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function MenuChecker({ searchTerms, mealType, date }) {
    const [restaurants, setRestaurants] = useState([]);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1); // Calculate the next day's date
    const formattedNextDay = formatDate(nextDay.toISOString().split('T')[0]); // Format the next day's date

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

    return (
        <div>
            {restaurants.length > 0 && (
                <div>
                    <h2>{mealType} Menu for {formattedNextDay}</h2>
                    {restaurants.map((restaurant, index) => (
                        <div key={index}>
                            <h3>{restaurant.name}</h3>
                            <ul>
                                {restaurant.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MenuChecker;
