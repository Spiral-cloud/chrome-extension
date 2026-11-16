const dataUrl = "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=5d&interval=1d";

let stockData = [];

function parseQuestion(question, rows) {
  const text = question.toLowerCase();

  if (!rows.length) {
    return "No stock data available yet.";
  }

  const latest = rows[rows.length - 1];
  const first = rows[0];
  const maxClose = rows.reduce((best, row) => row.close > best.close ? row : best, rows[0]);
  const minClose = rows.reduce((best, row) => row.close < best.close ? row : best, rows[0]);

  if (text.includes("highest") || text.includes("max") || text.includes("peak")) {
    return `The highest close was ${maxClose.close.toFixed(2)} on ${maxClose.date}.`;
  }

  if (text.includes("lowest") || text.includes("min") || text.includes("low")) {
    return `The lowest close was ${minClose.close.toFixed(2)} on ${minClose.date}.`;
  }

  if (text.includes("latest") || text.includes("current") || text.includes("last price") || text.includes("price now")) {
    return `The latest close is ${latest.close.toFixed(2)} on ${latest.date}.`;
  }

  if (text.includes("start") || text.includes("first") || text.includes("opening")) {
    return `The first close in this dataset was ${first.close.toFixed(2)} on ${first.date}.`;
  }

  if (text.includes("average") || text.includes("mean")) {
    const avg = rows.reduce((sum, row) => sum + row.close, 0) / rows.length;
    return `The average close is ${avg.toFixed(2)} across ${rows.length} records.`;
  }

  if (text.includes("volume")) {
    return `Latest volume is ${Number(latest.volume).toLocaleString()}.`;
  }

  return `I can answer questions like: highest close, lowest close, latest price, average close, first close, and volume.`;
}

async function loadStockData() {
  const summary = document.getElementById("summary");
  const rowsEl = document.getElementById("rows");

  try {
    const response = await fetch(dataUrl);
    const data = await response.json();
    const chart = data.chart;
    const result = chart && chart.result && chart.result[0];

    if (!result || !result.indicators || !result.indicators.quote[0]) {
      throw new Error("No chart data returned");
    }

    const quote = result.indicators.quote[0];
    const timestamps = result.timestamp || [];
    const entries = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      open: Number(quote.open[i] ?? 0),
      high: Number(quote.high[i] ?? 0),
      low: Number(quote.low[i] ?? 0),
      close: Number(quote.close[i] ?? 0),
      volume: Number(quote.volume[i] ?? 0),
    })).filter((row) => row.close > 0);

    stockData = entries.slice(-10).reverse();

    rowsEl.innerHTML = stockData
      .map(
        (row) => `
          <tr>
            <td>${row.date}</td>
            <td>${row.open.toFixed(2)}</td>
            <td>${row.close.toFixed(2)}</td>
            <td>${row.high.toFixed(2)}</td>
            <td>${row.low.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const latestClose = stockData[stockData.length - 1]?.close ?? 0;
    summary.textContent = `AAPL latest close: $${latestClose.toFixed(2)}`;
    addChatMessage("AI", "I can answer stock questions from the current dataset.");
  } catch (error) {
    console.error(error);
    summary.textContent = "Unable to load stock data.";
    addChatMessage("AI", "Please try again later or refresh the extension.");
  }
}

function addChatMessage(sender, message) {
  const output = document.getElementById("chat-output");
  const entry = document.createElement("div");
  entry.className = "chat-message";
  entry.innerHTML = `<strong>${sender}:</strong> ${message}`;
  output.appendChild(entry);
  output.scrollTop = output.scrollHeight;
}

function handleAsk() {
  const input = document.getElementById("question");
  const question = input.value.trim();
  if (!question) {
    return;
  }

  addChatMessage("You", question);
  input.value = "";

  const answer = parseQuestion(question, stockData);
  addChatMessage("AI", answer);
}

document.getElementById("ask-btn").addEventListener("click", handleAsk);
document.getElementById("question").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAsk();
  }
});

loadStockData();
