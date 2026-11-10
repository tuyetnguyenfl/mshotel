
// BeyondMe Journal Administration
// Administrator login, image uploads, story management,
// drafts, publishing, editing, and deleting.

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

const loginForm = document.getElementById("login-form");
const postForm = document.getElementById("post-form");

const loginMessage = document.getElementById("login-message");
const postMessage = document.getElementById("post-message");
const postsMessage = document.getElementById("posts-message");

const postList = document.getElementById("post-list");

const logoutButton = document.getElementById("logout-button");
const newPostButton = document.getElementById("new-post-button");
const cancelEditButton = document.getElementById("cancel-edit-button");

const editorHeading = document.getElementById("editor-heading");

// Image upload elements.
const imageFileInput = document.getElementById("post-image-file");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById("image-preview-container");
const removeImageButton = document.getElementById("remove-image-button");

let editingPostId = null;
let previewObjectUrl = null;


// ---------------------------------------------------------
// MESSAGE HELPERS
// ---------------------------------------------------------

function showMessage(element, message, type = "success") {
    element.textContent = message;
    element.className = `message ${type}`;
    element.hidden = false;
}

function hideMessage(element) {
    element.hidden = true;
    element.textContent = "";
}


// ---------------------------------------------------------
// API HELPER
// ---------------------------------------------------------

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: "same-origin",
        headers: {
            ...(options.body ? {
                "Content-Type": "application/json"
            } : {}),
            ...options.headers
        }
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        const error = new Error(
            data.error ||
            data.message ||
            `Request failed (${response.status})`
        );

        error.status = response.status;
        throw error;
    }

    return data;
}


// ---------------------------------------------------------
// IMAGE PREVIEW
// ---------------------------------------------------------

function clearImagePreview() {
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
    }

    imagePreview.removeAttribute("src");
    imagePreviewContainer.hidden = true;
}

imageFileInput.addEventListener("change", () => {
    const file = imageFileInput.files[0];

    clearImagePreview();

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        imageFileInput.value = "";

        showMessage(
            postMessage,
            "Please choose a JPG, PNG, or WebP image.",
            "error"
        );

        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        imageFileInput.value = "";

        showMessage(
            postMessage,
            "Your image must be no larger than 5 MB.",
            "error"
        );

        return;
    }

    previewObjectUrl = URL.createObjectURL(file);

    imagePreview.src = previewObjectUrl;
    imagePreviewContainer.hidden = false;

    hideMessage(postMessage);
});

removeImageButton.addEventListener("click", () => {
    imageFileInput.value = "";

    // Also clear an existing URL if the user removes the image.
    document.getElementById("post-image").value = "";

    clearImagePreview();
});


// ---------------------------------------------------------
// UPLOAD BLOG IMAGE
// ---------------------------------------------------------

async function uploadBlogImage(file) {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch("/api/admin/uploads", {
        method: "POST",
        credentials: "same-origin",
        body: formData
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        const error = new Error(
            data.error || "Image upload failed."
        );

        error.status = response.status;
        throw error;
    }

    if (!data.imageUrl) {
        throw new Error("The server did not return an image path.");
    }

    return data.imageUrl;
}


// ---------------------------------------------------------
// SHOW LOGIN OR DASHBOARD
// ---------------------------------------------------------

function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    logoutButton.hidden = true;
}

function showDashboard() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    logoutButton.hidden = false;
}


// ---------------------------------------------------------
// CHECK EXISTING ADMIN SESSION
// ---------------------------------------------------------

async function checkAdminSession() {
    try {
        await apiRequest("/api/admin/me");

        showDashboard();
        await loadPosts();

    } catch {
        showLogin();
    }
}


// ---------------------------------------------------------
// ADMIN LOGIN
// ---------------------------------------------------------

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    hideMessage(loginMessage);

    const formData = new FormData(loginForm);

    const username = formData.get("username").trim();
    const password = formData.get("password");

    const submitButton = loginForm.querySelector(
        "button[type='submit']"
    );

    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";

    try {
        await apiRequest("/api/admin/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            })
        });

        loginForm.reset();

        showDashboard();
        await loadPosts();

    } catch (error) {
        showMessage(
            loginMessage,
            error.message || "Unable to sign in.",
            "error"
        );

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Sign in to dashboard";
    }
});


// ---------------------------------------------------------
// ADMIN LOGOUT
// ---------------------------------------------------------

logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
        await apiRequest("/api/admin/logout", {
            method: "POST"
        });

        resetEditor();
        showLogin();

    } catch (error) {
        alert(error.message || "Unable to log out.");

    } finally {
        logoutButton.disabled = false;
    }
});


// ---------------------------------------------------------
// RESET EDITOR
// ---------------------------------------------------------

function resetEditor() {
    postForm.reset();

    imageFileInput.value = "";
    clearImagePreview();

    editingPostId = null;

    editorHeading.textContent = "Create a new story";

    cancelEditButton.hidden = true;

    hideMessage(postMessage);
}


// ---------------------------------------------------------
// NEW STORY BUTTON
// ---------------------------------------------------------

newPostButton.addEventListener("click", () => {
    resetEditor();

    document.getElementById("post-title").focus();

    document.getElementById("editor-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// ---------------------------------------------------------
// CANCEL EDITING
// ---------------------------------------------------------

cancelEditButton.addEventListener("click", () => {
    resetEditor();
});


// ---------------------------------------------------------
// CREATE OR UPDATE STORY
// ---------------------------------------------------------

postForm.addEventListener("submit", async event => {
    event.preventDefault();

    hideMessage(postMessage);

    const submitButton = event.submitter;

    if (!submitButton) {
        return;
    }

    const status = submitButton.value || "draft";

    const formData = new FormData(postForm);

    const imageFile = imageFileInput.files[0];

    const post = {
        title: formData.get("title").trim(),
        category: formData.get("category"),
        excerpt: formData.get("excerpt").trim(),
        imageUrl: formData.get("imageUrl").trim(),
        content: formData.get("content").trim(),
        status
    };

    if (!post.title || !post.content) {
        showMessage(
            postMessage,
            "Please enter a title and story content.",
            "error"
        );
        return;
    }

    // Validate an optional external image URL.
    if (post.imageUrl) {
        try {
            const imageUrl = new URL(post.imageUrl);

            if (!["http:", "https:"].includes(imageUrl.protocol)) {
                throw new Error("Invalid image URL");
            }
        } catch {
            showMessage(
                postMessage,
                "Please enter a valid image URL beginning with http:// or https://.",
                "error"
            );
            return;
        }
    }

    submitButton.disabled = true;

    const originalButtonText = submitButton.textContent;
    submitButton.textContent = imageFile
        ? "Uploading image..."
        : "Saving...";

    try {
        // Upload a selected image first.
        // The uploaded image takes priority over an external URL.
        if (imageFile) {
            const uploadedImageUrl = await uploadBlogImage(imageFile);

            post.imageUrl = uploadedImageUrl;
        }

        submitButton.textContent = "Saving story...";

        let result;

        if (editingPostId) {
            result = await apiRequest(
                `/api/admin/posts/${encodeURIComponent(editingPostId)}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(post)
                }
            );

            showMessage(
                postMessage,
                status === "published"
                    ? "Your story has been updated and published."
                    : "Your story has been saved as a draft."
            );

        } else {
            result = await apiRequest("/api/admin/posts", {
                method: "POST",
                body: JSON.stringify(post)
            });

            showMessage(
                postMessage,
                status === "published"
                    ? "Your story has been published successfully."
                    : "Your draft has been saved successfully."
            );
        }

        resetEditor();

        await loadPosts();

        showMessage(
            postsMessage,
            status === "published"
                ? "Story published successfully."
                : "Story saved successfully."
        );

    } catch (error) {
        showMessage(
            postMessage,
            error.message || "Unable to save your story.",
            "error"
        );

        if (error.status === 401) {
            showLogin();
        }

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});


// ---------------------------------------------------------
// LOAD ALL STORIES INCLUDING DRAFTS
// ---------------------------------------------------------

async function loadPosts() {
    postList.replaceChildren();

    const loading = document.createElement("p");
    loading.className = "empty-list";
    loading.textContent = "Loading your stories...";

    postList.appendChild(loading);

    try {
        const data = await apiRequest("/api/admin/posts");

        if (!Array.isArray(data.posts)) {
            throw new Error("Unexpected response from the server.");
        }

        renderPosts(data.posts);

    } catch (error) {
        postList.replaceChildren();

        const message = document.createElement("p");
        message.className = "empty-list";
        message.textContent = error.message || "Unable to load stories.";

        postList.appendChild(message);

        if (error.status === 401) {
            showLogin();
        }
    }
}


// ---------------------------------------------------------
// DISPLAY STORY COLLECTION
// ---------------------------------------------------------

function renderPosts(posts) {
    postList.replaceChildren();

    if (posts.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-list";
        empty.textContent =
            "Your journal is empty. Create your first story to get started.";

        postList.appendChild(empty);
        return;
    }

    posts.forEach(post => {
        postList.appendChild(createPostElement(post));
    });
}


// ---------------------------------------------------------
// CREATE POST CARD SAFELY
// ---------------------------------------------------------

function createPostElement(post) {
    const article = document.createElement("article");
    article.className = "post-item";

    const title = document.createElement("h3");
    title.textContent = post.title || "Untitled story";

    const meta = document.createElement("p");
    meta.className = "post-meta";

    const date = post.updatedAt
        ? new Date(post.updatedAt)
        : new Date(post.createdAt);

    const dateText = Number.isNaN(date.getTime())
        ? "Date unavailable"
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });

    meta.textContent = `${post.category || "Journal"} · ${dateText}`;

    const status = document.createElement("span");
    status.className = `status ${
        post.status === "published" ? "published" : "draft"
    }`;

    status.textContent = post.status || "draft";

    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = post.excerpt || "No introduction provided.";

    const actions = document.createElement("div");
    actions.className = "post-actions";

    const editButton = document.createElement("button");
    editButton.className = "btn btn-secondary";
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        editPost(post);
    });

    const toggleButton = document.createElement("button");
    toggleButton.className = "btn btn-secondary";
    toggleButton.type = "button";

    toggleButton.textContent = post.status === "published"
        ? "Move to draft"
        : "Publish";

    toggleButton.addEventListener("click", () => {
        changePostStatus(post);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        deletePost(post);
    });

    actions.append(editButton, toggleButton, deleteButton);

    article.append(title, meta, status, excerpt, actions);

    return article;
}


// ---------------------------------------------------------
// EDIT EXISTING STORY
// ---------------------------------------------------------

function editPost(post) {
    resetEditor();

    editingPostId = post._id;

    document.getElementById("post-title").value =
        post.title || "";

    document.getElementById("post-category").value =
        post.category || "Travel";

    document.getElementById("post-excerpt").value =
        post.excerpt || "";

    document.getElementById("post-image").value =
        post.imageUrl || "";

    document.getElementById("post-content").value =
        post.content || "";

    // Show the currently saved image as a preview.
    if (post.imageUrl) {
        imagePreview.src = post.imageUrl;
        imagePreviewContainer.hidden = false;
    }

    editorHeading.textContent = "Edit your story";

    cancelEditButton.hidden = false;

    hideMessage(postMessage);

    document.getElementById("editor-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ---------------------------------------------------------
// CHANGE DRAFT / PUBLISHED STATUS
// ---------------------------------------------------------

async function changePostStatus(post) {
    const newStatus = post.status === "published"
        ? "draft"
        : "published";

    const confirmation = newStatus === "published"
        ? "Publish this story to your public Journal?"
        : "Move this story back to drafts? It will no longer appear publicly.";

    if (!confirm(confirmation)) {
        return;
    }

    try {
        await apiRequest(
            `/api/admin/posts/${encodeURIComponent(post._id)}`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        showMessage(
            postsMessage,
            newStatus === "published"
                ? "Story published successfully."
                : "Story moved to drafts."
        );

        await loadPosts();

    } catch (error) {
        showMessage(
            postsMessage,
            error.message || "Unable to change story status.",
            "error"
        );
    }
}


// ---------------------------------------------------------
// DELETE STORY
// ---------------------------------------------------------

async function deletePost(post) {
    const confirmation = confirm(
        `Are you sure you want to permanently delete "${post.title}"?`
    );

    if (!confirmation) {
        return;
    }

    try {
        await apiRequest(
            `/api/admin/posts/${encodeURIComponent(post._id)}`,
            {
                method: "DELETE"
            }
        );

        if (editingPostId === post._id) {
            resetEditor();
        }

        showMessage(
            postsMessage,
            "Story deleted successfully."
        );

        await loadPosts();

    } catch (error) {
        showMessage(
            postsMessage,
            error.message || "Unable to delete story.",
            "error"
        );
    }
}


// ---------------------------------------------------------
// STARTUP
// ---------------------------------------------------------

checkAdminSession();
