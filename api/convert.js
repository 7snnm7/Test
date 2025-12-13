function count(q) {
  var url = "https://api.countapi.xyz";

  // Get current value
  var current = JSON.parse(HTTP.get(url + "/get/yourchannel/count").body).value || 0;

  if (!q) {
    return current.toString();
  }

  var n = Number(q);
  if (isNaN(n)) {
    return "Invalid number";
  }

  // Update counter
  var updated = JSON.parse(
    HTTP.get(url + "/update/yourchannel/count?amount=" + n).body
  ).value;

  return updated.toString();
}

count(q);