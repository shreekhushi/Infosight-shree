import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Start with 'dark' as the default theme.
const initialTheme = browser ? window.localStorage.getItem('theme') ?? 'dark' : 'dark';

export const theme = writable(initialTheme);

// Save the user's preference to localStorage whenever it changes.
theme.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('theme', value);
  }
});