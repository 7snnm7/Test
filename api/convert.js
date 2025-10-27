function convert(q) {
  if (!q) return 'Input should be in this state “!c OX OY OZ” or “!c NX NY NZ” check out my creator twitch.tv/hassannm7';
  
  const parts = q.trim().split(/\s+/).filter(Boolean);
  const isOver = parts[0].toLowerCase() === 'o';
  const nums = parts.filter(x => !isNaN(x)).map(Number);

}

convert(q);