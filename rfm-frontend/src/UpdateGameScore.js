/** Function to update the game score and results to the API */

const updateGameScore = async () => {

  const scoreData = {
    difficulty: level,
    q_and_a: gameData,
    score: score,
    curr_hi_score: hiScore,
  };

  try {
    const response = await fetch(`http://localhost:3001/data/${user.username}/process`, {
      //  user.username,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Game score updated successfully', result);
    } else {
      console.error('Error updating score');
    }
  } catch (error) {
    console.error('Error with API request:', error);
  }
};

export default updateGameScore;