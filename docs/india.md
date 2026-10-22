# INDIA — Product Proposal & Project Plan

## 1. Project Overview

**Project Name:** Beyond Me

**Project Type:** Personal Brand Website and Interactive Community Platform

**Repository:** [mshotel](https://github.com/tuyetnguyenfl/mshotel)

**Project Status:** Planning and Design

**Initial Release:** Release 1.0

### Product Vision

Beyond Me is a personal website that combines my identity, interests, hobbies, blog articles, and live interactions into one easily accessible online destination.

I want to create a website that I control and can grow overtime rather than relying just on other social networking platforms. Visistor will be able to read my material, watch live broadcasts, learn more about me, explore my hobbies, and take part in live conversations.

Public viewing without requiring an account will be supported in the initial version. Future authentication and restricted viewing will be supported by the system, enabling me to add private streams, authorized viewers, or members-only access as the platform develops.

### Problem Statement

Articles, hobbies, live interactions and personal information are frequently dispersed over several platforms. Visitors find it challenging to learn about a person's interests and track their activities in one location as a result.

In order to solve this issue, Beyond Me developed a single, adaptable website that incorporates community engagement, live video, publishing possibilities, and personal content.

### Value Proposition

Visitors may find my personal brand, read my articles, explore my interests, watch live broadcasts, and take part in conversations all from one place on the internet.

The platform gives me more control over my community, broadcasts, content, and digital identity as the creator. Its modular architecture will allow future features to be introduced without rebuilding the entire application.


## 2. Target Users

### Primary User: Website Owner and Creator

The creator manages the website, publishes articles, organizes hobbies and personal content, starts and ends live broadcasts, and moderates comments.

The creator is the only person authorized to publish video in Release 1.0.

### Secondary Users: Visitors and Community Members

Visitors can browse public website content and watch public live streams without creating an account. They can participate in live comments subject to the site's moderation rules.

Future versions may require visitors to sign in or receive explicit approval before viewing selected broadcasts.

### User Needs

- Learn about the creator's identity, background, and interests.
- Read blog posts and explore hobbies.
- Access the website on desktop and mobile devices.
- Watch live broadcasts directly through the website.
- Participate in real-time conversations during broadcasts.
- Receive clear feedback when content or a live stream is unavailable.
- Access private streams only when authorized, if restricted viewing is introduced in the future.

## 3. User Stories

### Personal Identity and Navigation

- As a visitor, I want to learn about the creator so that I can understand their background and interests.
- As a visitor, I want clearly organized website sections so that I can find relevant information easily.
- As a visitor, I want a responsive interface so that I can use the website on desktop and mobile devices.

### Blog and Hobbies

- As the creator, I want to create, edit, publish, and delete content so that I can maintain the website.
- As the creator, I want to organize content into categories so that visitors can navigate it easily.
- As a visitor, I want to browse blog posts so that I can learn from the creator's experiences and ideas.
- As a visitor, I want to explore hobby categories so that I can discover the creator's interests.

### Live Broadcasting

- As the creator, I want to use my browser's camera and microphone to broadcast directly from the website.
- As the creator, I want to preview my camera and microphone before going live.
- As the creator, I want to start and end broadcasts securely.
- As the creator, I want to moderate comments so that the community remains respectful.
- As a visitor, I want to watch public broadcasts without installing another application.
- As a visitor, I want to know whether a broadcast is live, offline, or ended.
- As a visitor, I want to post comments and see new comments without refreshing the page.


### Future Account-Based Access

- As a visitor, I want to register and sign in if an upcoming feature requires an account.
- As an authenticated visitor, I want to access restricted streams only when I have permission.
- As the creator, I want to choose whether a broadcast is public or restricted.
- As the creator, I want to approve specific viewers for private broadcasts.
- As the system owner, I want the backend to enforce access rules so that users cannot bypass restrictions by accessing a video provider directly.

These account-related stories describe future functionality and are not all required for Release 1.0.

## 4. Product Scope

### Release 1.0 — Minimum Viable Product

The first release will focus on three capabilities.

#### Capability A: My Identity

- Personal profile and introduction.
- About section and personal interests.
- Responsive navigation and page layout.
- Consistent visual identity and styling.

#### Capability B: My Journal

- Blog and personal content listings.
- Hobby and interest categories.
- Content detail pages.
- Creator-only content management.
- Persistent content storage using MongoDB Atlas.

#### Capability C: My Live Community

- Browser-based camera and microphone access.
- Creator-only broadcasting.
- Public live viewing without an account.
- Real-time comments using Socket.IO.
- Persistent comment history using MongoDB.
- Basic comment moderation.
- Live, offline, and ended broadcast states.
- Backend-controlled live-session access policies.

### Out of Scope for Release 1.0

The following features are planned for possible future releases:

- Public account registration and sign-in.
- Private and members-only broadcasts.
- Paid memberships and subscriptions.
- Donations and payment processing.
- Multi-creator broadcasting.
- Advanced video editing.
- Guaranteed recording and replay.
- Native mobile applications.
- Advanced recommendation algorithms.
- Large-scale custom streaming infrastructure.

The first release will establish the core product and technical foundation before these features are introduced.

## 5. Competitive Landscape

| Alternative | Strength | Opportunity for Beyond Me |
|---|---|---|
| Website builders such as Wix | Convenient website creation and templates | Build a customized full-stack application |
| Publishing platforms such as Substack | Writing and publishing tools | Combine personal identity, hobbies, and live interaction |
| Streaming platforms such as YouTube Live | Established live-video features | Provide a more integrated personal website experience |
| Multiple separate social accounts | Familiar platforms and existing audiences | Bring personal content and community interaction together |

The goal is not to reproduce every feature of these services. It is to build a focused personal website that demonstrates a connected user experience and practical full-stack engineering.

## 6. Technical Architecture

### 6.1 Proposed Technology Stack

- **Frontend:** HTML, CSS, and JavaScript.
- **Backend:** Node.js and Express.
- **Database:** MongoDB Atlas using the MongoDB Node.js Driver.
- **Real-time communication:** Socket.IO for live comments and related events.
- **Live video:** WebRTC publishing through a managed streaming provider with a Selective Forwarding Unit (SFU), subject to provider evaluation.
- **Authentication:** A secure server-side authentication design when account features are introduced.
- **Version control and planning:** GitHub repository, issues, milestones, branches, and pull requests.
- **Deployment:** Existing deployment infrastructure, subject to verification and configuration.

The live-video provider has not yet been selected. Provider selection is a prerequisite for finalizing the streaming implementation.

### 6.2 System Architecture

The application will follow this general flow:

1. The browser loads the static frontend.
2. The frontend uses `fetch()` to communicate with the Express API.
3. Express validates requests and reads or writes persistent data in MongoDB Atlas.
4. The creator requests permission to start a broadcast.
5. The backend verifies the creator's authorization.
6. The backend obtains or issues appropriately scoped, short-lived streaming credentials through the selected provider's supported integration.
7. The creator's browser publishes camera and microphone media using WebRTC.
8. The streaming provider's SFU distributes the media to authorized viewers.
9. Socket.IO delivers real-time comments to clients connected to the appropriate live-session room.
10. MongoDB stores session metadata and comment history.

### 6.3 Separation of Responsibilities

The architecture will separate four major responsibilities.

**Frontend**

- Display the website and content.
- Request camera and microphone access.
- Display the creator's preview and live broadcast.
- Display comments and stream status.
- Show sign-in or access-denied interfaces when needed.

**Express Backend**

- Manage content and live sessions.
- Verify creator authorization.
- Apply viewing access policies.
- Manage authentication and authorization when accounts are introduced.
- Validate API requests.
- Protect streaming credentials and secrets.

**MongoDB Atlas**

- Store blog posts and hobby content.
- Store live-session metadata and access settings.
- Store comments and their associated session identifiers.
- Store user and authorization-related records if account features are introduced.

**Streaming Provider**

- Receive the creator's audio and video.
- Distribute the live media to viewers.
- Enforce supported publishing and viewing access controls.

### 6.4 Live Video and Chat Are Separate Systems

WebRTC and the selected streaming provider deliver the actual audio and video. Socket.IO handles real-time comments and related application events. MongoDB provides persistent storage.

Socket.IO alone does not distribute live video.

A managed SFU is proposed because it forwards the creator's media to multiple viewers without requiring the creator's browser to establish a separate media connection to every viewer.

The selected provider must be evaluated for browser support, public and restricted viewing, token security, pricing, usage limits, and deployment requirements.

---

## 7. Backend Design: Authentication and Access Control

### 7.1 Authentication Versus Authorization

Authentication determines who a user is. Authorization determines which actions and resources that user may access.

The backend must enforce authorization independently of the frontend interface. Hiding a button or protecting a page visually is not sufficient.

### 7.2 Release 1.0 Access Rules

- Public visitors may watch public broadcasts without an account.
- Only the authorized creator may start or end a broadcast.
- Only the authorized creator may publish video.
- Viewers cannot manage live sessions or access creator-only operations.
- Viewing credentials are issued through the backend's authorization flow.
- Streaming-provider secrets are never exposed in frontend JavaScript.

### 7.3 Future Access Modes

The backend should be designed to support these viewing modes:

| Access mode | Intended behavior |
|---|---|
| `public` | Anyone can watch the stream |
| `authenticated` | The viewer must sign in |
| `approved_users` | The viewer must sign in and have explicit permission |

The initial release will enable public viewing. The other modes will remain future capabilities until authentication and the corresponding authorization rules are implemented and tested.

A `members_only` mode may be added later if membership functionality is developed.

### 7.4 Authorization Flow

For a public stream:

1. A visitor opens the viewing page.
2. The frontend requests viewing access from the backend.
3. The backend confirms that the session is available and publicly viewable.
4. The backend returns safe viewing information or provider-supported viewing credentials.
5. The visitor watches the stream.

For a restricted stream in a future release:

1. The visitor opens the viewing page.
2. The backend determines whether the stream requires authentication.
3. The visitor signs in if necessary.
4. The backend verifies the viewer's identity and permission to access that session.
5. The backend issues appropriately scoped, short-lived viewing credentials only if access is allowed.
6. Otherwise, the frontend displays a sign-in prompt or access-denied message.

The streaming provider must also enforce appropriate restrictions. A frontend login screen alone cannot protect a private stream.

### 7.5 Future Authentication Design

When account functionality is introduced, the system will need:

- User registration and sign-in.
- Secure password handling if passwords are used.
- Server-side session management or another secure authentication mechanism.
- Appropriate cookie and session protections.
- Authorization checks on protected backend endpoints.
- A method for associating approved viewers with restricted sessions.
- Account and permission validation for moderation and other privileged operations.

These features will be implemented in a later milestone rather than being falsely treated as complete in Release 1.0.

---

## 8. Live-Session Data Model

Each live-session record should contain the information necessary to manage a broadcast and its access policy.

### Proposed Fields

- `title`: the broadcast title.
- `status`: the broadcast state, such as `offline`, `live`, or `ended`.
- `accessMode`: the configured viewing policy.
- `creatorId`: the identity of the authorized creator.
- `providerRoomId`: the provider-specific room or session identifier, when applicable.
- `createdAt`: the session creation timestamp.
- `startedAt`: the broadcast start timestamp, when applicable.
- `endedAt`: the broadcast end timestamp, when applicable.

### Access-Mode Values

- `public`
- `authenticated`
- `approved_users`

New sessions will default to `public` for Release 1.0.

The backend must validate access-mode values and enforce the selected policy. The stored field describes the intended policy; it does not replace server-side authorization.

Provider secrets, long-lived credentials, and publishing tokens must not be returned as ordinary public session data.

### Comments

Each comment should be associated with its live session and contain appropriate metadata, such as:

- Session identifier.
- Comment text.
- Creation timestamp.
- Author identifier or display name, according to the implemented identity model.

Release 1.0 can support public comments without requiring user accounts, subject to moderation and rate limiting. Future authenticated comments can associate a comment with a verified account.

## 9. Security, Privacy, and Moderation

Security is part of the product's definition of done.

### Creator Authorization

- Only the authorized creator can start or end a broadcast.
- Only the creator can publish video to the channel.
- Public viewers cannot obtain creator publishing credentials.
- Content-management and administrative endpoints require appropriate authorization.

### Credential Management

- Store database credentials and provider secrets in environment variables or deployment secrets.
- Exclude `.env` files and private keys from source control.
- Never expose long-lived provider secrets in frontend JavaScript.
- Use short-lived, appropriately scoped credentials when supported by the provider.
- Avoid logging sensitive credentials.

### Comment Moderation

- Validate comment content and impose reasonable length limits.
- Restrict moderation actions to authorized users.
- Allow the creator to remove inappropriate comments.
- Apply reasonable rate limits and basic spam prevention.
- Define clear community rules.
- Handle abusive behavior appropriately.

### Privacy and Consent

- Request camera and microphone permissions through the browser.
- Clearly indicate when a broadcast is live and publicly accessible.
- Stop local camera and microphone tracks when the creator ends a broadcast.
- Clearly communicate whether recording is supported before implementing any recording feature.
- Avoid promising recording, replay, or privacy behavior that has not been implemented and tested.

### Restricted Viewing Security

When account-based viewing is introduced:

- Enforce the configured access mode on the backend.
- Verify authentication and authorization before issuing viewing credentials.
- Use provider-supported controls to prevent unauthorized direct access.
- Do not rely on hidden pages or frontend-only checks.
- Test that unauthorized viewers cannot bypass access restrictions.

---

## 10. Definition of Done — KILO

Release 1.0 is complete when the following acceptance criteria have been satisfied.

### Website and Content

- The website has a responsive personal-brand interface.
- Visitors can navigate the identity, blog, and hobbies sections.
- The creator can manage supported content through protected operations.
- Content persists in MongoDB Atlas.
- The frontend and Express backend exchange JSON through working API endpoints.

### Live Broadcasting

- The creator can request camera and microphone permissions and preview the media.
- The creator can start and stop a broadcast from the website.
- Unauthorized visitors cannot publish to the channel.
- Multiple public viewers can watch the same broadcast, subject to provider limits.
- The interface displays the correct live, offline, or ended state.
- The website handles denied permissions, unavailable streams, and connection failures.

### Live Comments

- Viewers can submit comments during a broadcast.
- Comments appear for connected viewers without refreshing the page.
- Comments are associated with the correct live session.
- Recent comments can be retrieved from persistent storage.
- The creator can remove inappropriate comments.
- Basic input validation and rate limiting are implemented.

### Backend and Security

- Creator-only operations are protected by backend authorization.
- Provider secrets are not committed to the repository or exposed in frontend code.
- The backend has a defined access-policy design for future restricted viewing.
- Public viewing works without requiring an account in Release 1.0.
- The project documentation clearly distinguishes implemented features from future enhancements.

### Quality and Deployment

- The application is deployed to an accessible environment.
- Required secrets are configured securely.
- Core user flows are tested.
- Desktop and mobile layouts are checked.
- Setup instructions and architecture documentation are available.
- The final demonstration shows the website, content management, live broadcasting, public viewing, and comments.

Future account registration and restricted-viewing functionality will have separate acceptance criteria when that work is scheduled.

## 11. GitHub Milestones

1. [Personal Identity & Website Foundation](https://github.com/tuyetnguyenfl/mshotel/milestone/2)
2. [Blog & Content Management](https://github.com/tuyetnguyenfl/mshotel/milestone/3)
3. [Community & Live Streaming](https://github.com/tuyetnguyenfl/mshotel/milestone/4)
4. [User Testing & Security](https://github.com/tuyetnguyenfl/mshotel/milestone/5)
5. [Demo Ready & Release 1.0](https://github.com/tuyetnguyenfl/mshotel/milestone/6)

## 12. GitHub Issues and Implementation Order

1. [Issue 1: Research and Select the Live Streaming Approach](https://github.com/tuyetnguyenfl/mshotel/issues/3)
2. [Issue 2: Implement Secure Live-Session Management](https://github.com/tuyetnguyenfl/mshotel/issues/4)
3. [Issue 3: Build Browser-Camera Broadcasting](https://github.com/tuyetnguyenfl/mshotel/issues/5)
4. [Issue 4: Build Public Live-Viewing Page](https://github.com/tuyetnguyenfl/mshotel/issues/6)

## 13. Project Risks and Open Questions

| Risk or question | Planned response |
|---|---|
| Streaming-provider cost and usage limits | Compare providers before implementation and document expected costs |
| Browser camera or microphone permissions | Provide a preview, clear instructions, and error messages |
| Multiple viewers and media delivery | Use a suitable SFU-based architecture and verify provider limits |
| Unauthorized broadcasting | Enforce server-side creator authorization and short-lived publishing credentials |
| Future restricted viewing | Select a provider that supports suitable viewing-access controls |
| Account security | Add secure authentication and authorization when account features are scheduled |
| Comment spam and abuse | Add validation, rate limiting, and creator moderation |
| Internet interruptions | Handle connection states and provide appropriate recovery behavior |
| Deployment configuration | Verify environment variables, provider configuration, and HTTPS requirements |
| Project scope | Prioritize the minimum viable product and defer advanced features |

## 14. Future Enhancements — Spring 99

After Release 1.0, possible enhancements include:

### Accounts and Access Control

- User registration and sign-in.
- Account-required live viewing.
- Private broadcasts for approved users.
- Members-only viewing if membership functionality is developed.
- Creator-managed viewer permissions.
- Additional account roles and moderation capabilities.

### Content and Community

- Scheduled live sessions and notifications.
- Optional recordings and replay, subject to provider support and appropriate consent.
- Richer visitor profiles.
- Additional content categories and improved search.
- Progressive Web App capabilities.
- Advanced moderation tools.
- Analytics for content engagement and live attendance.
- Accessibility and usability improvements.

These enhancements will be considered after the core experience is stable and the required security controls have been tested.

## 15. Project Management and Development Workflow

GitHub will serve as the central location for source code, planning, issues, milestones, and documentation.

The development workflow will include:

1. Review the product proposal and acceptance criteria.
2. Create and prioritize GitHub issues.
3. Work on a dedicated branch for each meaningful feature or fix.
4. Commit changes using descriptive messages.
5. Test implementations before merging.
6. Update documentation as architecture and features evolve.
7. Verify the deployed application against the definition of done.
8. Close issues only after their acceptance criteria have been met.

The existing `mshotel` repository will be reused where appropriate. Its existing frontend, Node.js, Express, MongoDB, and deployment setup will be assessed before deciding which parts to retain, improve, or replace.

The planning document must describe proposed features accurately and must not claim that a feature is implemented until it has been completed and verified.

---

## 16. Project Success Criteria

The project will be considered successful when:

- Visitors can understand the creator's identity and explore personal content.
- The creator can manage blog posts and hobby content.
- The creator can broadcast from the website using the browser's camera and microphone.
- Public visitors can watch the live stream.
- Visitors can participate in real-time comments.
- The creator can control the broadcast and moderate the conversation.
- Data persists appropriately in MongoDB Atlas.
- The backend protects creator-only operations and streaming credentials.
- The application is deployed and its core workflows are demonstrated successfully.
- The repository documents requirements, implementation, testing, and release status.
- The architecture supports future account-based and restricted viewing without requiring a complete redesign.

**Final Objective:** Build a personal digital home that combines identity, publishing, and live community interaction in one secure, accessible, and extensible web application.
