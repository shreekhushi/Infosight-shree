<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const scheduleURL = 'http://localhost:8000/schedule-interview/';

  let candidate_name = '';
  let candidate_email = '';
  let interviewer_email = '';
  let start_time = '';
  let duration = 30;
  
  let isLoading = false;
  let statusMessage = '';

  async function handleSubmit() {
    isLoading = true;
    statusMessage = 'Scheduling...';
    
    const formData = new FormData();
    formData.append('candidate_name', candidate_name);
    formData.append('candidate_email', candidate_email);
    formData.append('interviewer_email', interviewer_email);
    formData.append('start_time', new Date(start_time).toISOString());
    formData.append('duration', duration);

    try {
      const response = await fetch(scheduleURL, { 
        method: 'POST', 
        body: formData 
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Request failed');
      statusMessage = data.message;
      setTimeout(() => dispatch('close'), 2500); // Close modal on success
    } catch (error) {
      statusMessage = `Error: ${error.message}`;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="form-container">
  <div class="header">
    <span class="header-icon">🗓️</span>
    <h3>Schedule an Interview</h3>
  </div>
  <p class="description">Fill in the details below to create and send a calendar invitation.</p>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="candidateName">Candidate Name</label>
      <input id="candidateName" type="text" bind:value={candidate_name}  required />
    </div>
    
    <div class="form-group">
      <label for="candidateEmail">Candidate Email</label>
      <input id="candidateEmail" type="email" bind:value={candidate_email}  required />
    </div>

    <div class="form-group">
      <label for="interviewerEmail">Interviewer's Email</label>
      <input id="interviewerEmail" type="email" bind:value={interviewer_email}  required />
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="start_time">Interview Start Time</label>
        <input id="start_time" type="datetime-local" bind:value={start_time} required />
      </div>

      <div class="form-group">
        <label for="duration">Duration (mins)</label>
        <input id="duration" type="number" bind:value={duration} required />
      </div>
    </div>

    <button type="submit" disabled={isLoading}>
      {#if isLoading}Scheduling...{:else}Schedule Interview{/if}
    </button>
  </form>
  
  {#if statusMessage}
    <p class="status {statusMessage.startsWith('Error') ? 'error' : 'success'}">{statusMessage}</p>
  {/if}
</div>

<style>
  .form-container { 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
  }
  .header-icon {
    font-size: 1.5rem;
  }
  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--text-primary);
  }
  .description {
    text-align: center;
    margin-top: -1rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
  
  label {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  input { 
    width: 100%; 
    padding: 12px; 
    border-radius: var(--radius-md); 
    border: 1px solid var(--border-color); 
    background: var(--background-input); 
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  input:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(var(--accent-blue), 0.2);
  }

  button {
    margin-top: 0.5rem;
    padding: 12px;
  }

  .status { 
    text-align: center; 
    margin-top: 0.5rem; 
    font-weight: 500; 
    padding: 10px;
    border-radius: var(--radius-md);
  }
  .status.success {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22C55E;
  }
  .status.error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
</style>