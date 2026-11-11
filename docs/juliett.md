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
- JULIETT documentation: https://github.com/tuyetnguyenfl/mshotel/blob/capstone-planning/docs/juliett.md

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
- [ ] Prepare the LiveKit test as optional technical evidence, not a required production feature.
- [ ] Confirm LiveKit credentials and network connectivity before the demonstration.
- [ ] Prepare multiple browser tabs if demonstrating multiple viewers.

## 5. Detailed Demo Script

### Part A — Problem and User 

**Opening:**

"Imagine having many experiences, interests, and stories worth sharing, but no single personal space that brings them together.

BeyondMe is my attempt to create that space.

It starts as a personal brand website and grows toward an interactive platform where people can discover stories, follow experiences, and eventually participate in a community."

### Part B — Experience the Product 

**Open:** Homepage

Demonstrate:

1. Homepage visual identity and overall design.
2. Personal introduction and philosophy.
3. Navigation between website sections.
4. Travel, cooking, and personal interests.
5. Journal entry point.

**Talking point:**

"I want visitors to understand the person behind the platform before interacting with its content."

### Part C — Something Interesting 

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

### Part D — Behind the Curtain 

Show only the relevant implementation.

**Architecture:**

`Browser → Express API → MongoDB Atlas`

Explain:

- The frontend uses JavaScript and `fetch()` to communicate with the backend.
- Express handles API requests and application logic.
- MongoDB Atlas stores persistent application data.
- Administrator authentication protects content-management operations.
- Uploaded journal images are served through the application.
- LiveKit provides the managed real-time video infrastructure being tested separately.

**Code references:**

- Backend: `server/app.js`
- Database: `server/mongo.js`
- Homepage: `public/index.html`
- Journal: `public/blog.html`
- Administrator dashboard: `public/admin.html`
- LiveKit test: `public/livekit-test.html`
- LiveKit client logic: `public/js/livekit-test.js`

**Talking point:**

"I chose this architecture to keep the application maintainable and make future features easier to integrate."

### Part E — Reality Check 

**Working and demonstrated:**

- Personal website and navigation.
- Journal publishing and management.
- Administrator login and sessions.
- Image upload.
- MongoDB persistence.
- Express API integration.
- LiveKit publisher token generation.
- LiveKit viewer token generation.
- Browser camera and microphone access.
- Publisher and viewer connections.
- Live video and audio communication.
- Multiple viewers in the same room.
- Remote video behavior when broadcasting stops.

**Still being developed or validated:**

- Production livestream integration into the main BeyondMe experience.
- Secure live-session lifecycle and viewer permissions.
- Production-ready token management and access controls.
- Community interaction and commenting.
- Optional viewer accounts and restricted viewing.
- Mobile network access and deployment configuration.

**Talking point:**

"I want to distinguish what I have actually implemented and tested from what remains on the roadmap. The LiveKit technical prototype has successfully demonstrated browser-based broadcasting, audio, and multiple viewers. However, the production livestream experience and its security controls are still being developed."

### Part F — What's Next 

Introduce the next development direction:

1. Complete LiveKit provider validation.
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

**Verified in local testing:**

- Administrator-protected publisher token generation.
- Administrator-protected viewer token generation.
- Browser camera access.
- Browser microphone access.
- Publisher connection to LiveKit.
- Viewer connection to the same room.
- Remote video reception.
- Audio communication between broadcaster and viewer.
- Multiple viewers connected through three browser tabs.
- Remote video disappears when broadcasting stops.

**Still pending:**

- Phone-to-computer connectivity.
- Production integration with the main BeyondMe website.
- Secure production live-session lifecycle.
- Final production access-permission validation.
- Public deployment and external network testing.

**Backup plan:**

If the live network demonstration fails:

- Show a short prerecorded video of the successful multi-viewer test.
- Use screenshots of the publisher and viewers.
- Continue with the main website demonstration.
- Do not spend demo time troubleshooting infrastructure.

**Important distinction:** The successful local LiveKit prototype is technical validation, not evidence that the production livestream feature is complete.

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

**Technical validation update:**

The LiveKit prototype has progressed beyond the initial video-only test. Browser camera, microphone, audio/video communication, and multiple viewers have been successfully tested locally.

Mobile access and production security validation remain outstanding.

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
