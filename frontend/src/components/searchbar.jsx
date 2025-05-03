import React, { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (input) => {
    setQuery(input);
    if (input.length > 1) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name); // Autofill search box
    setSuggestions([]); // Hide suggestions after selection
  };

  return (
    <div className="flex items-center justify-center w-full mt-4 border border-gray-300  rounded-full">
      <input
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 outline-none "
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 top-[110px] left-10 rounded mt-1 shadow-md">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
      <button className="px-5 py-3 bg-blue-950 text-white rounded-full">Search</button>
    </div>
  );
};

export default SearchBar;