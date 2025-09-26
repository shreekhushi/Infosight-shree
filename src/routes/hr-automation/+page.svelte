<script>
  import Chat from '$lib/components/Chat.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import OfferLetterForm from '$lib/components/OfferLetterForm.svelte';
  import OnboardingForm from '$lib/components/OnboardingForm.svelte';
  import InterviewSchedulerForm from '$lib/components/InterviewSchedulerForm.svelte';
  import { fly } from 'svelte/transition'; // Import for animations

  const processes = [
    { id: 'scheduler', title: 'Interview Scheduler', description: 'Automate scheduling interviews with candidates and hiring managers.' },
    { id: 'offerLetter', title: 'Generate Offer Letter', description: 'Create and customize professional offer letters from templates.' },
    { id: 'onboarding', title: 'Send Onboarding Documents', description: 'Automatically send required documents to new hires.' }
  ];

  let activeProcess = null;

  function openModal(processId) {
    activeProcess = processId;
  }

  function closeModal() {
    activeProcess = null;
  }
</script>

{#if activeProcess}
  <Modal on:close={closeModal}>
    {#if activeProcess === 'offerLetter'}
      <OfferLetterForm on:close={closeModal} />
    {:else if activeProcess === 'onboarding'}
      <OnboardingForm on:close={closeModal} />
    {:else if activeProcess === 'scheduler'}
      <InterviewSchedulerForm on:close={closeModal} />
    {/if}
  </Modal>
{/if}

<div class="page-container">
  
  <div class="header" in:fly={{ y: -20, duration: 400 }}>
    <h1><span class="header-icon">⚙️</span> HR Process Automation</h1>
    <p>Select a workflow below to begin, or ask the agent in the chat to start a process for you.</p>
  </div>
  
  <div class="process-grid">
    {#each processes as process, i}
      <div 
        class="process-card"
        in:fly={{ y: -20, duration: 300, delay: 150 + i * 100 }}
      >
        <div class="card-icon-wrapper">
          {#if process.id === 'scheduler'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"></path></svg>
          {:else if process.id === 'offerLetter'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"></path></svg>
          {:else if process.id === 'onboarding'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"></path></svg>
          {/if}
        </div>
        <h3>{process.title}</h3>
        <p class="description">{process.description}</p>
        <button on:click={() => openModal(process.id)}>Start Process</button>
      </div>
    {/each}
  </div>

</div>

<div class="bottom-chat-panel">
  <Chat mode="general" />
</div>

<style>
  :global(.main-content) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .page-container {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 12px;
  }
  .bottom-chat-panel {
    flex-shrink: 0;
    height: 40%;
    min-height: 350px;
    max-height: 400px;
    border-top: 1px solid var(--border-color);
    padding-top: 24px;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  h1 { 
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 2rem;
  }
  .header-icon { font-size: 2rem; }
  .header p { max-width: 500px; margin: 0.5rem auto 0; font-size: 1.1rem; }

  .process-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 1.5rem; 
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
  }
  .process-card { 
    background: var(--background-content); 
    border: 1px solid var(--border-color); 
    border-radius: 16px; 
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 12px rgba(var(--shadow-color), 0.05);
  }
  .process-card:hover { 
    transform: translateY(-5px); 
    border-color: var(--accent-blue);
    box-shadow: 0 8px 25px rgba(var(--shadow-color), 0.1);
  }
  
  .card-icon-wrapper {
    margin: 0 auto;
    background-color: var(--background-secondary);
    color: var(--text-primary);
    border-radius: 12px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
  }
  .card-icon-wrapper svg { width: 28px; height: 28px; }
  
  h3 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: var(--text-primary); }

  .description {
    color: var(--text-secondary);
    font-size: 0.95rem;
    flex-grow: 1;
    margin-bottom: 1.5rem;
  }
</style>