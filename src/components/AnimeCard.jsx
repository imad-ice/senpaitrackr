import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addToLibrary, getAnimeFromLibrary } from "../utils/storage"; // 
import { ThemeContext } from '../context/ThemeContext';

import { useContext } from 'react';


function AnimeCard({ id, name, src, score, episodes, type, watchType = "not_added"}) {
    const [selectedCategory, setSelectedCategory] = useState(watchType);
    const {theme} = useContext(ThemeContext);
    useEffect(() => {
      // Use getAnimeFromLibrary to find the anime's status
      const animeInLibrary = getAnimeFromLibrary(id);
      if (animeInLibrary) {
        setSelectedCategory(animeInLibrary.watchType);
      } else {
        setSelectedCategory("not_added"); 
      }
    }, [id]); 

    const handleChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);

        const animeObjectForStorage = {
            mal_id: id,
            title: name,
            images: { jpg: { large_image_url: src } },
            score: score,
            episodes: episodes,
            type: type
        };

      
        if (newCategory && newCategory !== "not_added") {
          addToLibrary(newCategory, animeObjectForStorage, 0, 0);
        } else if (newCategory === "not_added") {
         
          const lib = getAnimeFromLibrary(id)?.watchType; 
          if (lib) {
            const tempAnimeForRemoval = { mal_id: id, title: name, images: { jpg: { large_image_url: src }}, score, episodes, type };
            addToLibrary(null, tempAnimeForRemoval, 0, 0); 
          }
        }
    };

  return (
    <div data-theme={theme}>
      {/* Main card container: Increased width and height */}
      <div className="w-64 h-[544px] bg-neutral-200 dark:bg-zinc-600 shadow-lg rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition">
        {/* Link: Make it a flex container that fills the card's height */}
        <Link to={`/anime/${id}`} className="block flex flex-col h-full">
          <img
            src={src}
            alt={name}
            // Image: Full width of card, reduced fixed height, ensure it doesn't shrink
            className="w-full h-80 object-cover rounded-t-lg transition-transform duration-300 transform hover:scale-105 flex-shrink-0"
          />
          {/* Text content area: Grows to fill space, flex column, handles overflow */}
          <div className="p-4 flex-grow flex flex-col overflow-hidden">
            {/* Wrapper for title & details: Allows scrolling if content too tall, pushes select down */}
            <div className="overflow-y-auto mb-auto">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2 dark:text-white">{name}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium">Score:</span> {score ?? "N/A"}</p>
                <p><span className="font-medium">Episodes:</span> {episodes ?? "?"}</p>
                <p><span className="font-medium">Type:</span> {type}</p>
              </div>
            </div>
            {/* Select dropdown: Full width, ensure it doesn't shrink */}
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleChange(e)}
              className="w-full mt-2 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 flex-shrink-0"
              onClick={(e) => e.preventDefault()} // Prevent link navigation when clicking select
            >
              <option value="not_added">Add To List</option>
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="planToWatch">Plan to Watch</option>
              <option value="dropped">Dropped</option>
              <option value="onHold">On Hold</option>
            </select>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AnimeCard;
