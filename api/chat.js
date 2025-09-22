export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ hỗ trợ POST" });
  }

  try {
    const { message } = req.body;

    // Gọi API của OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // lấy API key từ Vercel
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // bạn có thể đổi sang model khác nếu muốn
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    // Trả kết quả về cho frontend
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Có lỗi xảy ra khi gọi API OpenAI" });
  }
}
