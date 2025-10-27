(function() {
  try {
    const message = 'Input should be in this state “!c OX OY OZ” or “!c NX NY NZ” check out my creator twitch.tv/hassannm7';
    console.log(JSON.stringify(message));
  } catch (e) {
    console.log(JSON.stringify("Error: " + e.message));
  }
})();