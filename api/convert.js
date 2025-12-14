function formatTitle(q, t) {
  if (!q) {
    "Please provide a channel name.";
    return;
  }

  if (!t || typeof t !== "string" || t.toLowerCase().includes("offline")) {
    "The channel " + q + " is currently offline.";
    return;
  }

  'The current title of ' + q + ' is "' + t + '"';
}

formatTitle(q, t);