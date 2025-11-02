function convert(q) {
  if (!q) return 'Input should be in this state “!c OX OY OZ” or “!c NX NY NZ” check out my creator twitch.tv/hassannm7';
  
  const parts = q.trim().split(/\s+/).filter(Boolean);
  const isOver = parts[0].toLowerCase() === 'o';
  const nums = parts.filter(x => !isNaN(x)).map(Number);

  if (nums.length < 2 || nums.length > 3)
    return 'Input should be in this state “!c OX OY OZ” or “!c o NX NY NZ” check out my creator twitch.tv/hassannm7';

  if (isOver) {
    const x = Math.round(nums[0] * 8);
    const z = Math.round(nums[nums.length - 1] * 8);
    return `Overworld Side Coordinates Are: (${x}, Y, ${z})`;
  } else {
    const x = Math.round(nums[0] / 8);
    const z = Math.round(nums[nums.length - 1] / 8);
    return `Nether Side Coordinates Are: (${x}, Y, ${z})`;
  }
}

convert(q);