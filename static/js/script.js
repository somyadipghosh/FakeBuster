document.getElementById('news-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const news = document.getElementById('news').value;

    const response = await fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `news=${encodeURIComponent(news)}`
    });

    const result = await response.json();
    document.getElementById('result').innerHTML = 
        result.prediction === "FAKE" 
        ? "🛑 FAKE NEWS DETECTED!" 
        : "✅ This news appears to be REAL.";
});
