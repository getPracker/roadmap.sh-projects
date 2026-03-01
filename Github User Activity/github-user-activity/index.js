#!/usr/bin/env node
import { fetchGithubUserActivity } from "./src/services.js";

// Get arguments from the terminal (skipping the first two default Node paths)
const [user] = process.argv.slice(2);

async function run() {
  try {
    const events = await fetchGithubUserActivity(user);

    if (events.length === 0) {
      console.log("No recent activity found for this user.");
      return;
    }

    console.log(`Recent Activity for ${user}:`);
    
    // Loop through the events and print readable lines
    events.forEach(event => {
  let action = "";

  switch (event.type) {
    case "PushEvent":
      // ✅ Safety check: ensure payload and commits exist
      const commits = event.payload?.commits || [];
      const commitCount = commits.length;
      action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
      break;

    case "IssuesEvent":
      // ✅ Safety check: ensure action exists
      const issueAction = event.payload?.action || "interacted with";
      action = `${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} an issue in ${event.repo.name}`;
      break;

    case "WatchEvent":
      action = `Starred ${event.repo.name}`;
      break;

    case "CreateEvent":
      action = `Created ${event.payload?.ref_type || 'resource'} in ${event.repo.name}`;
      break;

    default:
      // Fallback for events we haven't specifically handled
      action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
      break;
  }

  console.log(`- ${action}`);
});


  } catch (err) {
    // If GitHub returns a 404, it means the user doesn't exist
    console.error(`Error: ${err.message}`);
  }
}


run();
