function convert(q) {
  if (!q) return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS (Example: !ml 17/7/2025 04:50:54)';

  const parts = q.trim().split(/\s+/);
  if (parts.length !== 2) return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS (Example: !ml 17/7/2025 04:50:54)';

  const [dateStr, timeStr] = parts;
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year || !timeStr.match(/^\d{1,2}:\d{2}:\d{2}$/))
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS (Example: !ml 17/7/2025 04:50:54)';

  const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1];
  const formatted = `${shortMonth} ${day} ${year} ${timeStr}`;
  
  return `LIVE started ${dateStr} ${timeStr} PM ◆$(eval a=new Date('${formatted}');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('${formatted}'))/86400000+2))`;
}

convert(q);