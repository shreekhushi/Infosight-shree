import { writable } from 'svelte/store';

// This store holds the analysis results from the chat
// and makes them available to the resume page.
export const analysisResults = writable([]);