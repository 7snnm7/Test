function convert(q) {
  if (!q)
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  const parts = q.trim().split(/\s+/);
  if (parts.length < 3)
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  const [dateStr, timeStr, ampmRaw] = parts;
  const [day, month, year] = dateStr.split('/').map(Number);
  const ampm = ampmRaw?.toUpperCase();

  if (
    !day ||
    !month ||
    !year ||
    !timeStr.match(/^\d{1,2}:\d{2}:\d{2}$/) ||
    (ampm !== 'AM' && ampm !== 'PM')
  )
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/7/2025 04:50:54 PM)';

  // Convert to 24-hour format
  let [hh, mm, ss] = timeStr.split(':').map(Number);
  if (ampm === 'PM' && hh < 12) hh += 12;
  if (ampm === 'AM' && hh === 12) hh = 0;

  // Add +5 hours offset
  const date = new Date(year, month - 1, day, hh + 5, mm, ss);

  // Format numeric month (MM)
  const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  return `LIVE started ${dateStr} ${timeStr} ${ampm} ◆$(eval a=new Date('${formatted}');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('${formatted}'))/86400000+2))`;
}

convert(q);