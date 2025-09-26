<script>
  import Chat from '$lib/components/Chat.svelte';
  import { fade, fly } from 'svelte/transition';

  const resumeUploadURL = 'http://localhost:8000/upload-resume/'; 

  let files;
  let fileInput;
  let isUploading = false;
  let uploadResults = [];
  let isDragOver = false;

  function handleFileSelection(fileList) {
    if (!fileList || fileList.length === 0) return;
    files = fileList;
    uploadResults = Array.from(files).map(f => ({ name: f.name, status: 'Ready' }));
  }

  async function handleUploadResumes() {
    if (!files || files.length === 0) return;
    isUploading = true;
    uploadResults = Array.from(files).map(f => ({ name: f.name, status: 'Uploading' }));

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('resume_file', file); 
      try {
        const response = await fetch(resumeUploadURL, { method: 'POST', body: formData });
        if (!response.ok) return { name: file.name, status: 'Failed' };
        return { name: file.name, status: 'Success' };
      } catch (error) {
        return { name: file.name, status: 'Failed' };
      }
    });

    const results = await Promise.all(uploadPromises);
    uploadResults = results;
    isUploading = false;
    if (fileInput) fileInput.value = null;
  }
</script>

<div class="page-container">
  <div class="content-card" in:fly={{ y: -20, duration: 500, delay: 200 }}>
    
    <div class="step-section">
      <div class="step-header">
        <div class="step-number">1</div>
        <h2>Upload Resumes</h2>
      </div>
      <p class="step-description">Drag & drop or browse files to add them to the drive.</p>
      
      {#if !files || files.length === 0}
        <div 
          class="upload-zone"
          class:drag-over={isDragOver}
          on:dragenter|preventDefault|stopPropagation={() => isDragOver = true}
          on:dragleave|preventDefault|stopPropagation={() => isDragOver = false}
          on:dragover|preventDefault|stopPropagation
          on:drop|preventDefault|stopPropagation={(e) => {
            handleFileSelection(e.dataTransfer.files);
            isDragOver = false;
          }}
          on:click={() => fileInput.click()}
          in:fade={{ duration: 300, delay: 300 }}
        >
          <input type="file" bind:this={fileInput} on:change={(e) => handleFileSelection(e.target.files)} multiple style="display: none;" />
          <div class="upload-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 15.4 12 12.8l2.6 2.6 1.4-1.4-4-4-4 4 1.4 1.4zM8 17h8v2H8z"></path><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path></svg>
          </div>
          <strong>Drag & drop files here</strong>
          <span>or click to browse</span>
        </div>
      {:else}
        <div class="results-list" in:fade={{ duration: 300 }}>
          {#each uploadResults as result, i}
            <div class="file-item" in:fly={{ y: 20, duration: 300, delay: i * 50 }}>
              <span class="file-name">{result.name}</span>
              <span class="status-pill {result.status.toLowerCase()}">{result.status}</span>
            </div>
          {/each}
          {#if !isUploading}
            <div class="action-buttons">
              <button class="secondary" on:click={() => { files = null; uploadResults = []; }}>Clear</button>
              <button on:click={handleUploadResumes}>Upload to Drive</button>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="step-section">
       <div class="step-header">
        <div class="step-number">2</div>
        <h2>Analyze Resumes</h2>
      </div>
      <p class="step-description">Enter a job description below to analyze all resumes.</p>
      <div class="chat-wrapper">
        <Chat mode="analysis" />
      </div>
    </div>
  </div>
</div>

<style>
.page-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* Center the card horizontally */
  align-items: center; /* Center the card vertically */
  padding: 24px;
}

.content-card {
  width: 100%;
  max-width: 1200px; /* Controls the centered width */
  max-height: 95vh; /* Prevents card from being too tall */
  background: rgba(var(--background-content-rgb), 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--border-rgb), 0.2);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(var(--shadow-color), 0.5  );
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
}

.step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.step-number {
  background-color: var(--accent-blue);
  color: white;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  flex-shrink: 0;
}
h2 { font-size: 26px; margin: 0; }
.step-description {
  margin-left: 36px;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--text-secondary);
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 500px;
}
.upload-zone:hover, .upload-zone.drag-over {
  border-color: var(--accent-blue);
  background-color: rgba(var(--background-content-rgb), 0.8);
}
.upload-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-page);
  border-radius: 8px;
  color: var(--text-secondary);
}
.upload-zone strong { font-weight: 500; font-size: 1rem; }
.upload-zone span { color: var(--text-secondary); font-size: 0.9rem; }

.results-list { display: flex; flex-direction: column; gap: 10px; }
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: var(--background-page);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.file-name { font-size: 0.9rem; }

.status-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--text-primary);
}
.status-pill.ready { background-color: var(--background-secondary); }
.status-pill.uploading { background-color: var(--accent-blue); color: white; }
.status-pill.success { background-color: #16A34A; color: white; }
.status-pill.failed { background-color: #DC2626; color: white; }

.action-buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
.action-buttons button.secondary {
  background-color: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
.action-buttons button.secondary:hover { background-color: var(--border-color); }

.chat-wrapper { height: 450px; }
</style>