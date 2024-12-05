
export function debugging() {
    document.addEventListener("keydown", (event) => {
        if (event.altKey && event.key.toLowerCase() === "p") {
          const userInput = prompt("Debugging code:");
          if (!userInput) return; // Exit if the user cancels or enters nothing
      
          const currentDayUnix = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Start of today in Unix timestamp
          if (parseInt(userInput, 10) === currentDayUnix) {
            const debugThreshold = JSON.parse(localStorage.getItem("drawThreshold"))
            const debugDrawScores = JSON.parse(localStorage.getItem("drawScores"));
            alert(

              `Threshold = ${debugThreshold}\n\n
              Length of the object: ${Object.keys(debugDrawScores).length}\n\n` +
              Object.entries(debugDrawScores)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n")
            );
          }
        }
      });
      
}