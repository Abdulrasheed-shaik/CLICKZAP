import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner'; // Import toast for notifications
import { useNavigate } from 'react-router-dom';

const SearchBox = ({ isOpen, setIsOpen }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    const query = e.target.value.trim(); // Trim whitespace
    setSearchQuery(query);

    if (query === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/user/search?query=${query}`, {
        withCredentials: true, // Include credentials (cookies)
        headers: {
          'Content-Type': 'application/json', // Ensure proper headers
        },
      });
      if (res.data.success) {
        setSearchResults(res.data.users);
      } else {
        setSearchResults([]); // Clear results if no users found
      }
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      toast.error("Failed to fetch search results. Please try again."); // Display user-friendly error
      setSearchResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[40%] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Search Users</h2>
        <Input
          type="search"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-6"
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {searchResults.length === 0 ? (
              <p>No users found</p>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => {
                      navigate(`/profile/${user?._id}`);
                      setIsOpen(false); // Close the dialog box
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchBox;