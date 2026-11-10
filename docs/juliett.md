# JULIETT — BeyondMe Designed Product Demo

**Project:** BeyondMe  
**Repository:** https://github.com/tuyetnguyenfl/mshotel  
**Branch:** `capstone-planning`  
**Demo duration:** 10 minutes maximum  
**Demo type:** Live product demonstration with prepared backup evidence

---

## 1. Demo Objective

Demonstrate how BeyondMe provides a personal digital space where people can express themselves, share experiences, publish stories, and gradually build an interactive community.

The audience should experience the product before seeing its implementation.

**Core message:**

BeyondMe is more than a personal website. It is a foundation for sharing personal experiences, documenting growth, and connecting with others through stories and future interactive features.

## 2. Target Audience and Problem

People often share different parts of their lives across disconnected platforms. Their stories, interests, experiences, and personal identity become scattered.

BeyondMe aims to provide one personal platform where its creator can:

- Present a consistent personal identity.
- Share travel, cooking, and personal reflections.
- Publish and manage journal content.
- Build an audience and eventually interact with visitors.
- Expand into live broadcasting and community participation.

## 3. Demo Schedule

| Time | Section | Demonstration |
|---|---|---|
| 0:00–1:00 | Problem + User | Introduce the audience and product vision |
| 1:00–4:00 | Experience the Product | Explore homepage, identity, navigation, and Journal |
| 4:00–6:00 | Something Interesting | Demonstrate administrator publishing and image upload |
| 6:00–7:30 | Behind the Curtain | Show Express, MongoDB Atlas, authentication, and architecture |
| 7:30–8:30 | Reality Check | Explain working features and current limitations |
| 8:30–10:00 | What's Next | Introduce livestream roadmap and collect feedback |

## 4. Demo Preparation

### Application links

**Local application:**

- Homepage: http://localhost:3000/
- Journal: http://localhost:3000/blog.html
- Administrator dashboard: http://localhost:3000/admin.html
- LiveKit technical test: http://localhost:3000/livekit-test.html

**GitHub:**

- Repository: https://github.com/tuyetnguyenfl/mshotel
- Project proposal: https://github.com/tuyetnguyenfl/mshotel/blob/capstone-planning/docs/india.md
- Project branch: https://github.com/tuyetnguyenfl/mshotel/tree/capstone-planning

### Required preparation

- [ ] Start the Node.js application.
- [ ] Verify MongoDB Atlas connection.
- [ ] Open the homepage and Journal page.
- [ ] Verify administrator login.
- [ ] Prepare a sample journal entry and image.
- [ ] Confirm that the journal entry can be published and displayed publicly.
- [ ] Prepare a backup screenshot or short recording of the publishing workflow.
- [ ] Close unnecessary browser tabs and windows.
- [ ] Keep administrator credentials private.
- [ ] Prepare the LiveKit test as optional evidence, not a required production feature.

## 5. Detailed Demo Script

### Part A — Problem and User (1 minute)

**Opening:**

"Imagine having many experiences, interests, and stories worth sharing, but no single personal space that brings them together.

BeyondMe is my attempt to create that space.

It starts as a personal brand website and grows toward an interactive platform where people can discover stories, follow experiences, and eventually participate in a community."

### Part B — Experience the Product (3 minutes)

**Open:** Homepage

Demonstrate:

1. Homepage visual identity and overall design.
2. Personal introduction and philosophy.
3. Navigation between website sections.
4. Travel, cooking, and personal interests.
5. Journal entry point.

**Talking point:**

"I want visitors to understand the person behind the platform before interacting with its content."

### Part C — Something Interesting (2 minutes)

**Open:** Administrator dashboard

Demonstrate this scenario:

1. Log in as administrator.
2. Open journal management.
3. Create a new journal entry.
4. Enter a title and story.
5. Select a category.
6. Upload an image.
7. Publish the entry.
8. Open the public Journal page.
9. Show the newly published entry.

**Talking point:**

"The important part is that the content is not hardcoded into the page. I can manage and publish content through the application, and visitors can see the published result."

### Part D — Behind the Curtain (1.5 minutes)

Show only the relevant implementation.

**Architecture:**

`Browser → Express API → MongoDB Atlas`

Explain:

- The frontend uses JavaScript and `fetch()` to communicate with the backend.
- Express handles API requests and application logic.
- MongoDB Atlas stores persistent application data.
- Administrator authentication protects content-management operations.
- Uploaded journal images are served through the application.

**Code references:**

- Backend: `server/app.js`
- Database: `server/mongo.js`
- Homepage: `public/index.html`
- Journal: `public/blog.html`
- Administrator dashboard: `public/admin.html`

**Talking point:**

"I chose this architecture to keep the application maintainable and make future features easier to integrate."

### Part E — Reality Check (1 minute)

**Working and demonstrated:**

- Personal website and navigation.
- Journal publishing and management.
- Administrator login and sessions.
- Image upload.
- MongoDB persistence.
- Express API integration.
- LiveKit publisher/viewer token generation.
- Browser-to-browser live video test.

**Still being developed or validated:**

- Production livestream integration into the main BeyondMe experience.
- Audio verification.
- Multi-viewer testing.
- Secure live-session lifecycle and viewer permissions.
- Community interaction and commenting.
- Mobile network access and deployment configuration.

**Talking point:**

"I want to distinguish what I have actually implemented and tested from what remains on the roadmap. The livestream has passed an initial browser-to-browser video test, but it is not yet a finished production feature."

### Part F — What's Next (1.5 minutes)

Introduce the next development direction:

1. Complete the LiveKit provider validation.
2. Implement secure live-session management.
3. Integrate browser-camera broadcasting into BeyondMe.
4. Build a public live-viewing experience.
5. Add community interaction and future viewer accounts.
6. Test security, usability, and mobile access.
7. Prepare the first release.

**Closing:**

"BeyondMe begins with one person sharing their experiences. The long-term vision is to make it a space where people can discover stories, participate, and connect.

The next step is turning that vision into a reliable and interactive experience."

## 6. LiveKit Evidence and Backup Plan

The current LiveKit experiment is available at:

`http://localhost:3000/livekit-test.html`

**Verified in the initial local test:**

- Administrator-protected publisher token generation.
- Administrator-protected viewer token generation.
- Browser camera access.
- Publisher connection to LiveKit.
- Viewer connection to the same room.
- Remote video reception.
- Remote video disappears when broadcasting stops.

**Not yet verified:**

- Audio reception.
- More than one viewer.
- Phone-to-computer connectivity.
- Production integration and access permissions.

**Backup plan:**

If the live network demonstration fails:

- Show a short prerecorded video of the successful two-tab video test.
- Use screenshots of the publisher and viewer.
- Continue with the main website demonstration.
- Do not spend demo time troubleshooting infrastructure.

## 7. Audience Feedback

Capture audience feedback using these categories:

| Category | Meaning |
|---|---|
| 👍 Keep | Features or experiences worth preserving |
| 🔧 Improve | Existing features that need improvement |
| 🐛 Fix | Bugs or usability problems |
| 💡 Consider | New ideas or opportunities |
| 🗑️ Drop | Features that do not add enough value |

### Feedback log

| Category | Audience feedback | Action / Issue |
|---|---|---|
| | | |
| | | |
| | | |
| | | |

Meaningful feedback should become GitHub Issues, backlog updates, or milestone changes.

## 8. Related GitHub Issues

**Live streaming provider and implementation:**

- [Issue #3 — Research and Select the Live Streaming Approach](https://github.com/tuyetnguyenfl/mshotel/issues/3)
- [Issue #4 — Implement Secure Live-Session Management](https://github.com/tuyetnguyenfl/mshotel/issues/4)
- [Issue #5 — Build Browser-Camera Broadcasting](https://github.com/tuyetnguyenfl/mshotel/issues/5)
- [Issue #6 — Build Public Live-Viewing Page](https://github.com/tuyetnguyenfl/mshotel/issues/6)

## 9. What Changed Because of JULIETT?

Complete this section after the demo.

Document:

- Most important audience feedback.
- Features or design decisions that should change.
- New bugs discovered.
- New GitHub Issues created.
- Existing Issues reprioritized.
- Milestones or scope adjusted.

**JULIETT outcome:**

_To be completed after collecting audience feedback._

## 10. Demo Completion Checklist

- [ ] Product-first demonstration completed.
- [ ] Problem and target user explained.
- [ ] Main website demonstrated.
- [ ] Journal publishing scenario demonstrated.
- [ ] Backend and database architecture explained.
- [ ] Current limitations honestly presented.
- [ ] Future roadmap explained.
- [ ] Audience feedback collected.
- [ ] Feedback converted into actionable GitHub work.
- [ ] INDIA and JULIETT documentation updated.

---

**Final message:** BeyondMe is a growing personal platform. JULIETT demonstrates what works today, explains what is being built next, and uses real feedback to guide its evolution.