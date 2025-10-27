function convert(q) {
    let nums = q.trim().split(" ").map(Number);
    if (nums.length < 2 || nums.some(isNaN)) return "Input must be numbers";
    let x = Math.round(nums[0] / 8);
    let z = Math.round(nums[nums.length - 1] / 8);
    return `(${x}, Y, ${z})`;
}
convert(q);

