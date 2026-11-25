const API = "https://api.github.com";

async function githubRequest(path, token, options = {}) {
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "nar4frame-photo-admin",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const key = request.headers.get("X-Admin-Key");

    if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      category,
      title,
      location,
      imageName,
      imageBase64
    } = await request.json();

    if (!["landscape", "nature", "travel"].includes(category)) {
      return Response.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (!title || !imageName || !imageBase64) {
      return Response.json(
        { error: "Missing photo information" },
        { status: 400 }
      );
    }

    const token = env.GITHUB_TOKEN;
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const branch = env.GITHUB_BRANCH || "nar4frame-v4";

    if (!token || !owner || !repo) {
      throw new Error("GitHub configuration is missing");
    }

    const imagePath = `images/${imageName}`;

    // Upload image to GitHub
    const uploadImage = await githubRequest(
      `/repos/${owner}/${repo}/contents/${imagePath}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Add photo: ${title}`,
          content: imageBase64,
          branch
        })
      }
    );

    if (!uploadImage.ok) {
      const errorDetails = await uploadImage.text();

      throw new Error(
        `GitHub upload failed (${uploadImage.status}): ${errorDetails.slice(0, 500)}`
      );
    }

    // Read existing photo data
    const dataPath = "data/photos.json";

    const getData = await githubRequest(
      `/repos/${owner}/${repo}/contents/${dataPath}?ref=${branch}`,
      token
    );

    if (!getData.ok) {
      throw new Error("Could not read photo data");
    }

    const file = await getData.json();

    const binary = atob(file.content.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const currentData = JSON.parse(
      new TextDecoder().decode(bytes)
    );

    if (!Array.isArray(currentData[category])) {
      currentData[category] = [];
    }

    currentData[category].push({
      title,
      image: imagePath,
      location: location || ""
    });

    // Save updated photo data
    const saveData = await githubRequest(
      `/repos/${owner}/${repo}/contents/${dataPath}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `Add ${category} photo: ${title}`,
          content: btoa(
            unescape(
              encodeURIComponent(
                JSON.stringify(currentData, null, 2)
              )
            )
          ),
          sha: file.sha,
          branch
        })
      }
    );

    if (!saveData.ok) {
      throw new Error("Could not save photo data");
    }

    return Response.json({
      success: true,
      message: "Photo added successfully"
    });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
