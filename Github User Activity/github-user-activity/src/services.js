export async function fetchGithubUserActivity(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}/events`);

        if (!response.ok) {
            // Special handling for 404
            if (response.status === 404) throw new Error("User not found.");
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        // ✅ FIX 1: Use 'await' to get the actual array from the response
        const data = await response.json(); 
        
        // ✅ FIX 2: You MUST return the data so index.js can use it
        return data; 

    } catch (error) {
        // It's usually better to let the caller (run()) handle the logging
        // but if you log here, make sure you still throw or exit correctly.
        console.error("Failed to fetch data: " + error.message);
        process.exit(1); // Note: fixed the typo 'procees' to 'process'
    }
}
