function convert(q) {
  // If the user wrote nothing, tell them
  if (!q.trim()) {
    console.log("You didn’t write anything!");
    return;
  }

  // Otherwise, repeat exactly what they said
  console.log(q);
}

convert(q);