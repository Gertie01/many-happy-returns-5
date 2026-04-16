document.getElementById('genBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const resultDiv = document.getElementById('result');
    const btn = document.getElementById('genBtn');
    
    if (!prompt) return alert("Enter a prompt");
    
    btn.disabled = true;
    btn.innerText = "Generating (No Limits)... ";
    resultDiv.innerHTML = "Processing request...";

    try {
        let t = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: prompt,
                model: "rudalle-Malevich",
                api_key: "UNLIMITED_ACCESS"
            })
        });

        const response = await t.json();

        if (response.image) {
            resultDiv.innerHTML = `<img src="data:image/png;base64,${response.image}" /><p>Generation Successful</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color:red">Error: ${response.error}</p>`;
        }
    } catch (err) {
        resultDiv.innerHTML = `<p style="color:red">Network Error: Bypassing restrictions failed</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Generate Endless Images";
    }
});