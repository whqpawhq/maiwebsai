const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Thiếu tin nhắn" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chưa cấu hình OPENAI_API_KEY" });
    }

    // gọi API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // model nhẹ, nhanh
        messages: [
          { role: "system", content: "Bạn là chatbot thân thiện, trả lời ngắn gọn, dễ hiểu." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔹 OpenAI trả về:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "⚠️ Không có phản hồi";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    return res.status(500).json({ error: err.message });
  }
};
