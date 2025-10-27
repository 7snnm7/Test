function convert(q) {
  if (!q.trim()) {
    console.log(JSON.stringify("You didn’t write anything!"));
    return;
  }
  console.log(JSON.stringify(q));
}

convert(q);