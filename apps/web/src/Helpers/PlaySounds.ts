// Function to play the notification sound
export const playNotificationSound = () => {
  const notificationAudio = new Audio('/sounds/livechat-129007.mp3');

  // Check if the audio is not already playing
  if (notificationAudio.paused) {
    notificationAudio.play().catch((error) => {
      // Handle any errors with playing the audio
      console.error('Error playing notification sound:', error);
    });
  }
};
