document.getElementById("text-form").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const inputText = document.getElementById("text-input").value;
    if (!inputText.trim()) {
      alert("Please enter some text.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/v1/analyzer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to analyze text. Please try again.");
      }
  
      const data = await response.json();
      displayAnalysis(data.response);
    } catch (error) {
      console.error(error);
      alert("An error occurred while analyzing the text.");
    }
  });
  
  function displayAnalysis(response) {
    document.getElementById("words-count").textContent = response.wordsCount;
    document.getElementById("characters-count").textContent = response.charactersCount;
    document.getElementById("sentences-count").textContent = response.sentencesCount;
    document.getElementById("paragraphs-count").textContent = response.paragraphsCount;
    document.getElementById("longest-word").textContent = response.longestWord;
  
    document.getElementById("analysis-report").classList.remove("hidden");
  }
  