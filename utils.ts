
/**
 * Triggers a short vibration on the device if the browser supports it.
 * This is used to provide physical feedback for user interactions.
 */
export const hapticFeedback = () => {
  if (navigator.vibrate) {
    // A short 50ms vibration is a common and pleasant duration for button taps.
    navigator.vibrate(50);
  }
};
