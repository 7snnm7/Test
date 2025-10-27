function convert(q) {
  if (!q) return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  const parts = q.trim().split(/\s+/);
  if (parts.length !== 3) return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  const [dateStr, timeStr, ampm] = parts;
  const [day, month, year] = dateStr.split('/').map(Number);

  if (!day || !month || !year || !timeStr.match(/^\d{1,2}:\d{2}:\d{2}$/) || !/^(AM|PM)$/i.test(ampm))
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1];
  const ampmUpper = ampm.toUpperCase();
  const baseDate = new Date(`${shortMonth} ${day} ${year} ${timeStr} ${ampmUpper}`);

  if (isNaN(baseDate.getTime()))
    return '❌ Invalid date or time. Please check your input.';

  // ➕ Add 5 hours to match your region
  baseDate.setHours(baseDate.getHours() + 5);

  const adjustedMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][baseDate.getMonth()];
  const adjustedDay = baseDate.getDate();
  const adjustedYear = baseDate.getFullYear();
  const adjustedTime = baseDate.toTimeString().split(' ')[0]; // HH:MM:SS

  const formatted = `${adjustedMonth} ${adjustedDay} ${adjustedYear} ${adjustedTime}`;

  return `LIVE started ${dateStr} ${timeStr} ${ampmUpper} ◆$(eval a=new Date('${formatted}');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('${formatted}'))/86400000+2))`;
}

convert(q);