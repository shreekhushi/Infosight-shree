<script>
  import { onMount, tick } from 'svelte';

  const answerQueryURL = 'http://localhost:8000/answer-query/';

  // --- State is now much simpler ---
  let userInput = '';
  let isLoading = false;
  let messages = [
    { sender: 'bot', text: "Hello! I am the Self-Service Agent. Ask me any question about our company policies." }
  ];
  let chatWindow;

  // --- Logic is now direct, no more steps ---
  async function handleSendMessage() {
    if (userInput.trim() === '' || isLoading) return;

    const userQuestion = userInput;
    messages = [...messages, { sender: 'user', text: userQuestion }];
    userInput = '';
    scrollToBottom();
    isLoading = true;
    
    try {
      const formData = new FormData();
      formData.append('question', userQuestion);

      const response = await fetch(answerQueryURL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Request failed');

      const finalAnswer = data.answer || JSON.stringify(data, null, 2);
      messages = [...messages, { sender: 'bot', text: finalAnswer }];
      
    } catch (error) {
      messages = [...messages, { sender: 'bot', text: `❌ An error occurred: ${error.message}` }];
    } finally {
      isLoading = false;
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
    {#if isLoading}
      <div class="message-row bot typing-indicator"><div class="dot-flashing"></div></div>
    {/if}
  </div>
  <div class="input-area-wrapper">
    <form class="chat-input-form" on:submit|preventDefault={handleSendMessage}>
      <textarea 
        bind:value={userInput} 
        placeholder="Ask a question about company policies..." 
        on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
        disabled={isLoading}
      ></textarea>
      <button type="submit" class="send-button" title="Send" disabled={!userInput.trim() || isLoading}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
      </button>
    </form>
  </div>
</div>

<style>
/* --- The style section remains the same as before --- */
.chat-container { height: 100%; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; }
.chat-window { flex-grow: 1; overflow-y: auto; padding: var(--spacing-lg) var(--spacing-sm); display: flex; flex-direction: column; gap: 1.5rem; }
.message-row { display: flex; max-width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.bot { justify-content: flex-start; }
.message-bubble { padding: 10px 18px; border-radius: 20px; line-height: 1.6; word-wrap: break-word; max-width: 80%; }
.message-bubble p { margin: 0; color: var(--text-primary); }
.message-row.user .message-bubble { background-color: var(--message-bg-user); }
.message-row.user .message-bubble p { color: white; }
.message-row.bot .message-bubble { background-color: var(--message-bg-bot); }
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
</style>