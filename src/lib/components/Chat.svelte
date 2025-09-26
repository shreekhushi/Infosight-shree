<!-- <script>
  import { onMount, tick } from 'svelte';

  const analyzeApiURL = 'http://localhost:8000/analyze-drive/';

  let userInput = '';
  let messages = [ { sender: 'bot', text: "Welcome! Please enter a job description below to analyze all resumes in the drive." } ];
  let chatWindow; 
  let typingStatus = false;

  function createResultsTableHTML(results) {
    if (!results || results.length === 0) return '<p>No matching results were found.</p>';
    let tableHTML = `<div class="results-table-wrapper"><table><thead><tr><th>Filename</th><th>Score</th><th>Summary</th></tr></thead><tbody>`;
    for (const result of results) {
      const cleanFilename = String(result.filename || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const cleanSummary = String(result.summary || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
      tableHTML += `<tr><td>${cleanFilename}</td><td class="score">${result.score || 0}%</td><td>${cleanSummary}</td></tr>`;
    }
    tableHTML += '</tbody></table></div>';
    return tableHTML;
  }
  
  async function handleSendMessage() {
    if (userInput.trim() === '') return;
    const jobDescription = userInput;
    messages = [...messages, { sender: 'user', text: jobDescription }];
    userInput = '';
    scrollToBottom();
    typingStatus = true;
    messages = [...messages, { sender: 'bot', text: "Analyzing resumes..." }];
    scrollToBottom();

    try {
      // --- THIS IS THE CRITICAL CHANGE ---
      // 1. Create a FormData object instead of a JSON object
      const formData = new FormData();

      // 2. Append the job description as a form field
      formData.append('job_description', jobDescription);
      
      const response = await fetch(analyzeApiURL, {
        method: 'POST',
        // 3. Send the formData object as the body.
        // DO NOT set a 'Content-Type' header, the browser does it automatically.
        body: formData,
      });
      // --- END OF CHANGE ---

      if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);
      
      const data = await response.json();
      const tableResponse = createResultsTableHTML(data.results);
      messages = [...messages, { sender: 'bot', text: tableResponse }];
    } catch (error) {
      console.error("Analysis API Error:", error);
      messages = [...messages, { sender: 'bot', text: `❌ Sorry, the analysis failed. Please check the server. Error: ${error.message}` }];
    } finally {
      typingStatus = false;
      scrollToBottom();
    }
  }
  
  async function scrollToBottom() {
    await tick();
    if (chatWindow) chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
  }

  onMount(scrollToBottom);
</script>

<div class="chat-container">
  <div class="chat-window" bind:this={chatWindow}>
    {#each messages as message}
      <div class="message-row {message.sender}">
        <div class="message-bubble">
          <p>{@html message.text}</p>
        </div>
      </div>
    {/each}
    {#if typingStatus}
      <div class="message-row bot typing-indicator">
        <div class="dot-flashing"></div>
      </div>
    {/if}
  </div>
  <div class="input-area-wrapper">
    <form class="chat-input-form" on:submit|preventDefault={handleSendMessage}>
      <textarea 
        bind:value={userInput} 
        placeholder="Enter job description to analyze resumes..." 
        on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
      ></textarea>
      <button type="submit" class="send-button" title="Send" disabled={!userInput.trim()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
      </button>
    </form>
  </div>
</div>

<style>
/* --- Main Layout & Bubbles --- */
.chat-container { height: 100%; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; }
.chat-window { flex-grow: 1; overflow-y: auto; padding: var(--spacing-lg) var(--spacing-sm); display: flex; flex-direction: column; gap: 1.5rem; }
.message-row { display: flex; max-width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.bot { justify-content: flex-start; }
.message-bubble { padding: 10px 18px; border-radius: 20px; line-height: 1.6; word-wrap: break-word; max-width: 95%; }
.message-bubble p { margin: 0; color: var(--text-primary); }
.message-row.user .message-bubble { background-color: var(--message-bg-user); max-width: 80%; }
.message-row.user .message-bubble p { color: white; }
.message-row.bot .message-bubble { background-color: var(--message-bg-bot); }

/* --- Table Styles (Inside the Chat Bubble) --- */
.message-bubble :global(.results-table-wrapper) { max-width: 100%; overflow-x: auto; }
.message-bubble :global(table) { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem; }
.message-bubble :global(th), .message-bubble :global(td) { padding: 8px 12px; text-align: left; border: 1px solid var(--border-color); white-space: normal; }
.message-bubble :global(th) { background-color: var(--background-sidebar); }
.message-bubble :global(td.score) { font-weight: 600; color: var(--accent-blue); text-align: center; }

/* --- Input & Typing Styles --- */
.typing-indicator .dot-flashing { position: relative; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite linear alternate; animation-delay: .5s; }
.typing-indicator .dot-flashing::before, .typing-indicator .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
.typing-indicator .dot-flashing::before { left: -12px; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite alternate; animation-delay: 0s; }
.typing-indicator .dot-flashing::after { left: 12px; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite alternate; animation-delay: 1s; }
@keyframes dot-flashing { 0% { background-color: var(--text-secondary); } 50%, 100% { background-color: rgba(154, 154, 154, 0.2); } }
.input-area-wrapper { padding: var(--spacing-md) 0; flex-shrink: 0; }
.chat-input-form { display: flex; align-items: center; gap: var(--spacing-sm); background: var(--background-input); border-radius: 24px; padding: 8px; border: 1px solid var(--border-color); }
textarea { flex-grow: 1; border: none; background: transparent; color: var(--text-primary); font-size: 1rem; line-height: 1.5; padding: 10px; resize: none; height: 48px; max-height: 200px; font-family: inherit; }
textarea:focus { outline: none; }
textarea::placeholder { color: var(--text-secondary); }
.send-button { background-color: var(--accent-blue); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: all 0.2s ease; }
.send-button svg { width: 20px; height: 20px; }
.send-button:disabled { background-color: var(--border-color); cursor: not-allowed; }
.send-button:not(:disabled):hover { background-color: var(--accent-blue-hover); }
</style> -->


<script>
  import { onMount, tick } from 'svelte';

  export let mode = 'general';
  const analyzeApiURL = 'http://localhost:8000/analyze-drive/';
  const generalChatApiURL = 'PASTE_YOUR_OTHER_URL_FOR_GENERAL_CHAT_HERE';

  let userInput = '';
  let messages = [];
  let chatWindow; 
  let typingStatus = false;

  $: if (!messages.length) {
    if (mode === 'analysis') {
      messages = [{ sender: 'bot', text: "Welcome! Enter a job description to analyze all resumes." }];
    } else {
      messages = [{ sender: 'bot', text: "Hello! I am the HR Self-Service Agent. How can I help you?" }];
    }
  }

  function createResultsTableHTML(results) {
    if (!results || results.length === 0) return '<p>No matching results found.</p>';
    let tableHTML = `<div class="results-table-wrapper"><table><thead><tr><th>Filename</th><th>Score</th><th>Summary</th></tr></thead><tbody>`;
    for (const result of results) {
      const cleanFilename = String(result.filename || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const cleanSummary = String(result.summary || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
      tableHTML += `<tr><td>${cleanFilename}</td><td class="score">${result.score || 0}%</td><td>${cleanSummary}</td></tr>`;
    }
    tableHTML += '</tbody></table></div>';
    return tableHTML;
  }
  
  async function handleSendMessage() {
    if (userInput.trim() === '') return;

    const userMessage = userInput;
    messages = [...messages, { sender: 'user', text: userMessage }];
    userInput = '';
    scrollToBottom();
    typingStatus = true;
    
    if (mode === 'analysis') {
      const jobDescription = userMessage;
      messages = [...messages, { sender: 'bot', text: "Analyzing resumes..." }];
      scrollToBottom();
      try {
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        
        const response = await fetch(analyzeApiURL, {
          method: 'POST',
          body: formData, 
        });

        if (!response.ok) throw new Error(`Analysis failed: ${response.statusText}`);
        const data = await response.json();
        
        // --- THIS IS THE CORRECTED LINE ---
        const tableResponse = createResultsTableHTML(data.results);
        
        messages = [...messages, { sender: 'bot', text: tableResponse }];
      } catch (error) {
        messages = [...messages, { sender: 'bot', text: "❌ Analysis failed. Please check the backend." }];
      } finally {
        typingStatus = false;
        scrollToBottom();
      }
    } else {
      // General chat logic
      try {
        const payload = { message: userMessage };
        const response = await fetch(generalChatApiURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Chat API error");
        const data = await response.json();
        messages = [...messages, { sender: 'bot', text: data.reply }];
      } catch (error) {
        messages = [...messages, { sender: 'bot', text: "Sorry, the general chat is not connected." }];
      } finally {
        typingStatus = false;
        scrollToBottom();
      }
    }
  }
  
  async function scrollToBottom() {
    await tick();
    if (chatWindow) chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
  }

  onMount(scrollToBottom);
</script>

<div class="chat-container">
  <div class="chat-window" bind:this={chatWindow}>
    {#each messages as message}
      <div class="message-row {message.sender}">
        <div class="message-bubble">
          <p>{@html message.text}</p>
        </div>
      </div>
    {/each}
    {#if typingStatus}
      <div class="message-row bot typing-indicator"><div class="dot-flashing"></div></div>
    {/if}
  </div>
  <div class="input-area-wrapper">
    <form class="chat-input-form" on:submit|preventDefault={handleSendMessage}>
      <textarea 
        bind:value={userInput} 
        placeholder={mode === 'analysis' ? 'Enter job description to analyze...' : 'Ask a general question...'} 
        on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
      ></textarea>
      <button type="submit" class="send-button" title="Send" disabled={!userInput.trim()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
      </button>
    </form>
  </div>
</div>
<style>
/* --- Main Layout & Bubbles --- */
.chat-container { height: 100%; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; }
.chat-window { flex-grow: 1; overflow-y: auto; padding: var(--spacing-lg) var(--spacing-sm); display: flex; flex-direction: column; gap: 1.5rem; }
.message-row { display: flex; max-width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.bot { justify-content: flex-start; }
.message-bubble { padding: 10px 18px; border-radius: 20px; line-height: 1.6; word-wrap: break-word; max-width: 95%; }
.message-bubble p { margin: 0; color: var(--text-primary); }
.message-row.user .message-bubble { background-color: var(--message-bg-user); max-width: 80%; }
.message-row.user .message-bubble p { color: white; }
.message-row.bot .message-bubble { background-color: var(--message-bg-bot); }
/* --- Table Styles (Inside the Chat Bubble) --- */
.message-bubble :global(.results-table-wrapper) { max-width: 100%; overflow-x: auto; }
.message-bubble :global(table) { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem; }
.message-bubble :global(th), .message-bubble :global(td) { padding: 8px 12px; text-align: left; border: 1px solid var(--border-color); white-space: normal; }
.message-bubble :global(th) { background-color: var(--background-sidebar); }
.message-bubble :global(td.score) { font-weight: 600; color: var(--accent-blue); text-align: center; }
/* --- Input & Typing Styles --- */
.typing-indicator .dot-flashing { position: relative; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite linear alternate; animation-delay: .5s; }
.typing-indicator .dot-flashing::before, .typing-indicator .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
.typing-indicator .dot-flashing::before { left: -12px; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite alternate; animation-delay: 0s; }
.typing-indicator .dot-flashing::after { left: 12px; width: 6px; height: 6px; border-radius: 5px; background-color: var(--text-secondary); animation: dot-flashing 1s infinite alternate; animation-delay: 1s; }
@keyframes dot-flashing { 0% { background-color: var(--text-secondary); } 50%, 100% { background-color: rgba(154, 154, 154, 0.2); } }
.input-area-wrapper { padding: var(--spacing-md) 0; flex-shrink: 0; }
.chat-input-form { display: flex; align-items: center; gap: var(--spacing-sm); background: var(--background-input); border-radius: 24px; padding: 8px; border: 1px solid var(--border-color); }
textarea { flex-grow: 1; border: none; background: transparent; color: var(--text-primary); font-size: 1rem; line-height: 1.5; padding: 10px; resize: none; height: 48px; max-height: 200px; font-family: inherit; }
textarea:focus { outline: none; }
textarea::placeholder { color: var(--text-secondary); }
.send-button { background-color: var(--accent-blue); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: all 0.2s ease; }
.send-button svg { width: _20px; height: 20px; }
.send-button:disabled { background-color: var(--border-color); cursor: not-allowed; }
</style>