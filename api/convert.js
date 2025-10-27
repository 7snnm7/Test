function convert(q){
  try{
    if(!q) return '❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
    var s = String(q).trim();
    // normalize spaces
    s = s.replace(/\s+/g,' ').trim();
    // If AM/PM attached to time like 04:50:54PM, separate it
    s = s.replace(/(AM|PM)$/i, function(m){ return ' ' + m.toUpperCase(); });
    var parts = s.split(' ');
    if(parts.length < 3) return '❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
    var ampm = parts[parts.length-1].toUpperCase();
    var time = parts[parts.length-2];
    var dateParts = parts.slice(0, parts.length-2).join(' ');
    // dateParts should be like DD/MM/YYYY
    var md = dateParts.split('/');
    if(md.length!==3) return '❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
    var day = parseInt(md[0],10), month = parseInt(md[1],10), year = parseInt(md[2],10);
    if(!day||!month||!year) return '❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
    if(!/^\d{1,2}:\d{2}:\d{2}$/.test(time)) return '❌ Time must be HH:MM:SS';
    if(ampm!=='AM' && ampm!=='PM') return '❌ AM or PM required. Example: PM';
    // month name
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if(month<1||month>12) return '❌ Month must be 1-12';
    var M = months[month-1];
    // Build date string for JS, include AM/PM
    var jsDateStr = M + ' ' + day + ' ' + year + ' ' + time + ' ' + ampm;
    var date = new Date(jsDateStr);
    if(isNaN(date.getTime())) return '❌ Could not parse date/time — check values';
    // add +5 hours for your region
    date.setHours(date.getHours() + 5);
    var outMonth = months[date.getMonth()];
    var outDay = String(date.getDate()).padStart(2,'0');
    var outYear = date.getFullYear();
    var outTime = date.toTimeString().split(' ')[0]; // HH:MM:SS
    var finalDate = outMonth + ' ' + outDay + ' ' + outYear + ' ' + outTime;
    // Preserve original display day/month/year/time/ampm (zero-pad)
    var dd = String(day).padStart(2,'0'), mm = String(month).padStart(2,'0');
    var display = dd + '/' + mm + '/' + year + ' ' + time + ' ' + ampm;
    return "LIVE started " + display + " ◆$(eval a=new Date('" + finalDate + "');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('" + finalDate + "'))/86400000+2))";
  }catch(e){
    return '❌ Error: ' + e.message;
  }
}
convert(q);