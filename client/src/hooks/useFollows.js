import { useState, useEffect } from "react";

const useFollows = () => {
  const [follows, setFollows] = useState(() => {
    const saved = localStorage.getItem("betwise_follows");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("betwise_follows", JSON.stringify(follows));
  }, [follows]);

  const toggleFollow = (matchApiId) => {
    setFollows((prev) => 
      prev.includes(matchApiId) 
        ? prev.filter(id => id !== matchApiId) 
        : [...prev, matchApiId]
    );
  };

  const isFollowed = (matchApiId) => follows.includes(matchApiId);

  return { follows, toggleFollow, isFollowed };
};

export default useFollows;
