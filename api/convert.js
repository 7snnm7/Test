async function convert(q) {
  const key = "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"; // 👈 Paste your API key here (replace xx only)
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "اعطني موضوع نقاش عشوائي باللغة العربية" }]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result.choices?.[0]?.message?.content || "حدث خطأ في توليد الموضوع.");
}

convert(q);
