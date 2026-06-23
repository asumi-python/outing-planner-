let selectedMood = "";

document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMood = btn.dataset.mood;
  });
});

async function generatePlan() {
  const area = document.getElementById("area").value.trim();
  const budget = document.getElementById("budget").value;
  const people = document.getElementById("people").value;

  if (!selectedMood) {
    alert("気分を選んでください！");
    return;
  }
  if (!area) {
    alert("エリアを入力してください！");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("resultCard").style.display = "none";
  document.getElementById("submitBtn").disabled = true;

  const prompt = `
あなたはおでかけプランの提案が得意なアシスタントです。
以下の条件でおでかけプランを提案してください。

【条件】
- 気分：${selectedMood}
- エリア：${area}
- 予算（1人あたり）：${budget}
- 人数：${people}

【出力形式】
以下の形式で提案してください：

🍽️ ランチ・カフェ
（お店の雰囲気や料理のおすすめを2〜3行で）

🎯 メインの過ごし方
（どんな場所・活動がおすすめか2〜3行で）

🌙 締めくくり
（夕方〜夜の過ごし方を1〜2行で）

💬 一言アドバイス
（この条件にぴったりな一言を添えて）

具体的で楽しそうな提案をお願いします！
`;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`APIエラー: ${data.error.message}`);
    }
    const parts = data.candidates[0].content.parts;
    const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1];
    const text = textPart.text;

    document.getElementById("resultText").textContent = text;
    document.getElementById("resultCard").style.display = "block";

  } catch (error) {
    alert(`エラー: ${error.message}`);
  } finally {
    document.getElementById("loading").style.display = "none";
    document.getElementById("submitBtn").disabled = false;
  }
}
