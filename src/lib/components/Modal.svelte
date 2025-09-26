<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
</script>

<div class="modal-backdrop" transition:fade={{ duration: 200 }}>
  <div class="modal-content" transition:fly={{ y: -20, duration: 300 }}>
    <button class="close-btn" on:click={() => dispatch('close')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <slot />
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .modal-content {
    /* THIS IS THE FIX: Using a solid, opaque background color */
    background-color: var(--background-content);
    padding: 2rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: 0 5px 25px rgba(0,0,0,0.4);
    width: 100%;
    max-width: 500px;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  .close-btn:hover {
    background-color: var(--background-secondary);
  }
</style>