function convert(q) {
  if (!q)
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';

  const parts = q.trim().split(/\s+/);
  if (parts.length !== 3)
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';

  const [dateStr, timeStr, ampmRaw] = parts;
  const [day, month, year] = dateStr.split('/').map(Number);
  const ampm = ampmRaw.toUpperCase();

  if (
    !day || !month || !year ||
    !timeStr.match(/^\d{1,2}:\d{2}:\d{2}$/) ||
    (ampm !== "AM" && ampm !== "PM")
  )
    return '❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';

  // Convert to JS date format
  const shortMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1];
  const formatted = `${shortMonth} ${day} ${year} ${timeStr} ${ampm}`;

  // Add +5 hours for your region
  const date = new Date(`${formatted}`);
  date.setHours(date.getHours() + 5);
  const dateStrOut = date.toDateString().split(' ');
  const outputMonth = dateStrOut[1];
  const outputDay = date.getDate();
  const outputYear = date.getFullYear();
  const outputTime = date.toTimeString().split(' ')[0];

  const finalDate = `${outputMonth} ${outputDay} ${outputYear} ${outputTime}`;

  return `LIVE started ${day.toString().padStart(2,'0')}/${month.toString().padStart(2,'0')}/${year} ${timeStr} ${ampm} ◆$(eval a=new Date('${finalDate}');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('${finalDate}'))/86400000+2))`;
}

convert(q);