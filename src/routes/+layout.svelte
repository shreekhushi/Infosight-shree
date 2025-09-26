<script>
  import "../app.css";
  import { page } from '$app/stores';
  import { theme } from '$lib/theme.js';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  
  $: if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', $theme);
  }
</script>

<div class="app-layout">
  <aside class="nav-sidebar">
    <div class="sidebar-top">
      <a href="/" class="logo">
        <div class="logo-icon">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8565 2.54019 15.5783 3.49389 17L2.5 21.5L7 20.5061C8.42173 21.4598 10.1435 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 11H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 15H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </div>
        <span class="logo-text">HR-ChatBot</span>
      </a>
      <nav class="sidebar-nav">
        <a href="/resume-shortlisting" class:active={$page.url.pathname === '/resume-shortlisting'}>
          <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 13h-2v4h2v-4zm-1-8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm5 8h-2v4h2v-4z"></path></svg>
          <span>Resume Shortlisting</span>
        </a>
        <a href="/hr-automation" class:active={$page.url.pathname === '/hr-automation'}>
          <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m19.43 12.98-.46-3.39-2.28-1.59a.5.5 0 0 0-.66.13l-1.06 1.83-.02.03-2.12-2.12a.5.5 0 0 0-.71 0l-2.12 2.12-.03-.02-1.83-1.06a.5.5 0 0 0-.13-.66l-1.59-2.28-3.39-.46a.5.5 0 0 0-.43.43l-.46 3.39-1.59 2.28a.5.5 0 0 0 .13.66l1.83 1.06.02.03-2.12 2.12a.5.5 0 0 0 0 .71l2.12 2.12.03.02 1.06 1.83a.5.5 0 0 0 .66.13l2.28 1.59 3.39.46a.5.5 0 0 0 .43-.43l.46-3.39 2.28-1.59a.5.5 0 0 0 .13-.66l-1.83-1.06-.02-.03 2.12-2.12a.5.5 0 0 0 0-.71l-2.12-2.12.03-.02 1.06-1.83a.5.5 0 0 0-.13-.66l-1.59-2.28-3.39-.46zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>
          <span>HR Automation</span>
        </a>
        <a href="/self-service-agent" class:active={$page.url.pathname.startsWith('/self-service-agent')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"></path></svg>
          <span>Self-Service Agent</span>
        </a>
      </nav>
    </div>
    
    <div class="sidebar-footer">
        
        <ThemeToggle />
    </div>
  </aside>

  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  .app-layout { display: flex; height: 100vh; overflow: hidden; }
  .nav-sidebar {
    width: 260px;
    background-color: var(--background-content);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 12px;
    transition: background-color 0.2s, border-color 0.2s;
  }
  .main-content {
    flex-grow: 1;
    overflow-y: hidden;
    padding: 32px;
  }
  
  .logo { 
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 48px;
    padding: 0 12px;
    text-decoration: none;
  }
  .logo-icon {
    color: var(--accent-blue);
    width: 32px;
    height: 32px;
  }
  
  .sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
  .sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    color: var(--text-secondary);
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .sidebar-nav a:hover {
    background-color: var(--background-secondary);
    color: var(--text-primary);
  }
  .sidebar-nav a svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  .sidebar-nav a.active {
    background-color: var(--accent-blue);
    color: white;
    font-weight: 600;
  }
  /* On Dark Mode, make the active link text lighter for better contrast */
  html[data-theme='dark'] .sidebar-nav a.active {
    color: var(--text-primary);
  }
  
  .sidebar-footer {
    border-top: 1px solid var(--border-color);
    padding: 16px 4px 0 4px;
  }
  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--accent-blue);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }
  .user-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .user-name {
    font-weight: 600;
    color: var(--text-primary);
  }
  .user-role {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
</style>