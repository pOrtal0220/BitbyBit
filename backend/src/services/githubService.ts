import axios from "axios";

/**
 * Fetches the file structure or specific file content from a GitHub repo.
 * We use the standard GitHub REST API.
 */
export async function getRepoContent(repoUrl: string, path: string = "") {
  try {
    // 1. Extract owner and repo from the URL
    // Handles https://github.com/owner/repo
    const cleanUrl = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = cleanUrl.split("/");

    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL format.");
    }

    // 2. Call GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Cognizance-AI-Agent", // Required by GitHub
      },
    });

    // 3. If it's a file, decode the Base64 content. If it's a folder, return the list.
    if (Array.isArray(response.data)) {
      // It's a directory (returns a list of files)
      return response.data.map((file: any) => ({
        name: file.name,
        type: file.type,
        path: file.path
      }));
    } else {
      // It's a single file (returns the content)
      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      return content;
    }
  } catch (error: any) {
    console.error("GitHub Fetch Error:", error.response?.data || error.message);
    throw new Error(`Failed to access the GitHub repository. Ensure it is public.`);
  }
}