// ======== USERS (Frontend Simulated DB) ===========
const USERS = {
   yashraj : "123456",
  };
  
  // ========= DOM SELECTORS =
  // ==========================
  const loginForm = document.getElementById("login-form");
  const vaultBox = document.getElementById("vault-box");
  const authMsg = document.getElementById("auth-msg");
  const snippetInput = document.getElementById("snippet-input");
  const encryptBtn = document.getElementById("encrypt-btn");
  const decryptBtn = document.getElementById("decrypt-btn");
  const clearBtn = document.getElementById("clear-btn");
  const copyBtn = document.getElementById("copy-btn"); 
  const snippetOutput = document.getElementById("snippet-output");
  const toast = document.getElementById("toast");
  const historyContainer = document.getElementById("history");
  const charCount = document.getElementById("char-count");
  const themeToggle = document.getElementById("theme-toggle");
  const clearHistoryBtn = document.getElementById("clear-history-btn");  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
  
    const response = await fetch("http://localhost:4567/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  
    const result = await response.text();
    const authMsg = document.getElementById("auth-msg");
  
    if (result.includes("✅")) {
      document.querySelector(".auth-box").classList.add("hidden");
      document.getElementById("vault-box").classList.remove("hidden");
      showToast("Login successful!", false);
    } else {
      authMsg.textContent = result;
      showToast("Login failed!", true);
    }
  });
  
  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "show" + (isError ? " error" : "");
    setTimeout(() => (toast.className = ""), 3000);
  }
  
  // ========== LOGIN LOGIC ============================
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (USERS[username] && USERS[username] === password) {
      document.querySelector(".auth-box").classList.add("hidden");
      vaultBox.classList.remove("hidden");
      authMsg.textContent = "";
      loadHistory();
      showToast("Login Successful 🔓");
    } else {
      authMsg.textContent = "Invalid credentials.";
      showToast("Access Denied 🚫");
    }
  });
  
  // ======== ENCRYPTION LOGIC (Custom AES-ish) =========
  function encryptSnippet(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }
  
  function decryptSnippet(text) {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      showToast("Invalid encrypted string!", true);
      return "";
    }
  }
  
  // ========== BUTTON EVENTS ===========================
  encryptBtn.addEventListener("click", () => {
    const raw = snippetInput.value.trim();
    if (!raw) return;
  
    const encrypted = encryptSnippet(raw);
    snippetOutput.textContent = encrypted;
    saveToHistory(encrypted, "encrypted");
    showToast("Snippet Encrypted ✅");
  });
  
  decryptBtn.addEventListener("click", () => {
    const raw = snippetInput.value.trim();
    if (!raw) return;
  
    const decrypted = decryptSnippet(raw);
    snippetOutput.textContent = decrypted;
    saveToHistory(decrypted, "decrypted");
    showToast("Snippet Decrypted ✅");
  });
  
  clearBtn.addEventListener("click", () => {
    snippetInput.value = "";
    snippetOutput.textContent = "";
    charCount.textContent = "0 chars";
    showToast("Cleared 🧹");
  });
  
  copyBtn.addEventListener("click", () => {
    const text = snippetOutput.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Copied to Clipboard 📋");
  });
  
  snippetInput.addEventListener("input", () => {
    charCount.textContent = `${snippetInput.value.length} chars`;
  });
  
  // ========== LOCAL STORAGE HISTORY ===================
function saveToHistory(data, type) {
  const timestamp = new Date().toLocaleString();
  const entry = { data, type, timestamp };
  let history = JSON.parse(localStorage.getItem("vaultHistory")) || [];
  history.unshift(entry);
  localStorage.setItem("vaultHistory", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("vaultHistory")) || [];
  historyContainer.innerHTML = "";

  if (history.length === 0) {
      historyContainer.innerHTML = "<p>No entries yet...</p>";
  } else {
      history.slice(0, 5).forEach((entry) => {
          const div = document.createElement("div");
          div.className = "history-entry";
          div.innerHTML = `
              <span>[${entry.type.toUpperCase()}]</span> - 
              ${entry.data.substring(0, 40)}... <em>${entry.timestamp}</em>`;
          historyContainer.appendChild(div);
      });
  }
}

// Clear history functionality
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("vaultHistory");
  loadHistory();
  showToast("History Cleared 🧹");
});
loadHistory();



// Initial load of history on page load
loadHistory(); // Load history when the page is first opened

  // ========== TOAST FUNCTION ==========================
  function showToast(msg, error = false) {
    toast.textContent = msg;
    toast.className = error ? "error" : "success";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
  
  // ========== THEME TOGGLE ============================
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    showToast("Theme changed ! 🎨");
  });
  document.getElementById("registerBtn").addEventListener("click", () => {
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    fetch("http://localhost:4567/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => alert(msg));
});

document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:4567/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => alert(msg));
});
clearHistoryBtn.addEventListener("click", () => {
    // Clear history from localStorage
    localStorage.removeItem("vaultHistory");

    // Refresh the history container
    loadHistory();

    // Show a toast notification confirming the action
    showToast("History Cleared 🧹");
});

