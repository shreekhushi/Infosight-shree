<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const offerLetterURL = 'http://localhost:8000/generate-and-send-offer/';

  let candidate_name = '';
  let candidate_email = '';
  let job_title = '';
  let start_date = '';
  let salary = '';
  let manager_name = '';
  let deadline = '';
  let send_email = true;
  
  let isLoading = false;
  let statusMessage = '';

  async function handleSubmit() {
    isLoading = true;
    statusMessage = 'Processing...';
    
    const formData = new FormData();
    formData.append('candidate_name', candidate_name);
    formData.append('candidate_email', candidate_email);
    formData.append('job_title', job_title);
    formData.append('start_date', start_date);
    formData.append('salary', salary);
    formData.append('manager_name', manager_name);
    formData.append('deadline', deadline);
    formData.append('send_email', send_email);

    try {
      const response = await fetch(offerLetterURL, { method: 'POST', body: formData });
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
    <span class="header-icon">✉️</span>
    <h3>Generate Offer Letter</h3>
  </div>
  <p class="description">Fill in the candidate's details to generate and send a new offer letter.</p>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="candidateName">Candidate Name</label>
      <input id="candidateName" type="text" bind:value={candidate_name}  required />
    </div>
    
    <div class="form-group">
      <label for="candidateEmail">Candidate Email</label>
      <input id="candidateEmail" type="email" bind:value={candidate_email}  required />
    </div>

    <div class="form-row">
        <div class="form-group">
            <label for="jobTitle">Job Title</label>
            <input id="jobTitle" type="text" bind:value={job_title}  required />
        </div>
        <div class="form-group">
            <label for="salary">Salary</label>
            <input id="salary" type="number" bind:value={salary}  required />
        </div>
    </div>
    
    <div class="form-group">
        <label for="managerName">Hiring Manager Name</label>
        <input id="managerName" type="text" bind:value={manager_name} required />
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="start_date">Start Date</label>
        <input id="start_date" type="date" bind:value={start_date} required />
      </div>
      <div class="form-group">
        <label for="deadline">Response Deadline</label>
        <input id="deadline" type="date" bind:value={deadline} required />
      </div>
    </div>

    <label class="checkbox-label">
      <input type="checkbox" bind:checked={send_email} />
      Send email to candidate upon generation
    </label>

    <button type="submit" disabled={isLoading}>
      {#if isLoading}Processing...{:else}Generate & Send{/if}
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
    justify-content: center;
    gap: 0.75rem;
  }
  .header-icon { font-size: 1.5rem; }
  h3 { margin: 0; font-size: 1.4rem; color: var(--text-primary); }
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
    grid-template-columns: 1fr 1fr;
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

  .checkbox-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    padding: 0;
    border: none;
    background: none;
  }
  .checkbox-label input {
    width: auto;
    height: 16px;
    width: 16px;
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