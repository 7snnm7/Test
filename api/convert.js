function getTitle(q) {
  if (!q) {
    "Please provide a channel name.";
    return;
  }

  var url = "https://decapi.me/twitch/title/" + encodeURIComponent(q);

  var title = fetch(url).text();

  if (!title || title.toLowerCase().includes("offline")) {
    "The channel " + q + " is currently offline.";
    return;
  }

  'The current title of ' + q + ' is "' + title + '"';
}

getTitle(q);