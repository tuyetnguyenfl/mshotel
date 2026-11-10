# INDIA — Product Proposal & Project Plan

## 1. Project Overview

**Project Name:** BeyondMe

**Project Type:** Personal Brand Website and Interactive Community Platform

**Repository:** [mshotel](https://github.com/tuyetnguyenfl/mshotel)

**Project Status:** Active Development — Core Website and Journal Management Implemented

**Current Development Branch:** `capstone-planning`

**Initial Release:** Release 1.0

### Product Vision and User Story

BeyondMe is a personal digital home that brings my identity, interests, hobbies, journal, and future live interactions together in one accessible online destination.

As a personal content creator, I want to build BeyondMe as my own digital home where visitors can discover my identity, explore my interests, read my journal, and eventually watch live broadcasts and participate in real-time conversations, so that I can bring my personal content and community together in one platform while maintaining control over my digital identity and future growth.

## 2. Target Users

### Primary User: Website Owner and Creator

The creator manages the website, maintains personal information, publishes journal articles, organizes hobbies and personal content, and eventually starts and manages live broadcasts.

The creator is the only person authorized to publish video and manage administrative functions.

### Secondary Users: Visitors and Community Members

Visitors can browse public website content, explore personal interests, and read published journal entries.

The initial live-streaming experience is planned to allow visitors to watch public broadcasts without creating an account. Visitors may also participate in live conversations, subject to moderation rules.

Future versions may require visitors to sign in or receive explicit approval before viewing selected broadcasts.

### User Needs

- Learn about the creator's identity, background, and interests.
- Navigate the website easily.
- Read journal posts and explore hobbies.
- Access the website on desktop and mobile devices.
- Watch live broadcasts directly through the website when the feature is implemented.
- Participate in real-time conversations during broadcasts.
- Receive clear feedback when content or a live stream is unavailable.
- Access private streams only when authorized, if restricted viewing is introduced in the future.

## 3. User Stories

### Personal Identity and Navigation

- As a visitor, I want to learn about the creator so that I can understand their background and interests.
- As a visitor, I want clearly organized website sections so that I can find relevant information easily.
- As a visitor, I want a responsive interface so that I can use the website on desktop and mobile devices.

### Blog and Hobbies

- As the creator, I want to create, edit, publish, and delete journal content so that I can maintain my website.
- As the creator, I want to organize content into categories so that visitors can navigate it easily.
- As a visitor, I want to browse journal posts so that I can learn from the creator's experiences and ideas.
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

These account-related stories describe future functionality and are not all required for the initial public-viewing experience.

## 4. Product Scope

The project is being developed incrementally. The existing website and journal-management functionality form the foundation for the remaining Release 1.0 work.

### 4.1 Implemented Features

The following core features have been implemented and tested locally:

#### Capability A: Personal Identity Website

- Personal-brand homepage.
- Nature-inspired visual design and consistent blue and green brand identity.
- Personal introduction and interest sections.
- Website navigation and responsive page layout.
- Dedicated journal page.

#### Capability B: Journal and Content Management

- Journal listing page.
- Content categories, including Travel, Cooking, and Reflections.
- Journal post creation and editing through the admin dashboard.
- Publishing and unpublishing posts.
- Deleting posts.
- Image upload and image preview.
- Persistent journal content stored in MongoDB Atlas.
- Public API endpoints for retrieving published posts.
- Administrative access protected by login and session management.

#### Capability C: Backend Foundation

- Node.js and Express backend.
- MongoDB Atlas connection using the MongoDB Node.js Driver.
- Environment-based configuration.
- Admin authentication using password hashing.
- Server-side session management with MongoDB-backed session storage.
- Static frontend delivery and JSON API communication.

### 4.2 Remaining Release 1.0 Work

The following capabilities remain planned or under development:

#### My Live Community

- Research and select a suitable live-streaming provider.
- Browser-based camera and microphone access.
- Creator-only broadcasting.
- Public live viewing without requiring an account.
- Real-time comments using Socket.IO.
- Persistent comment history using MongoDB.
- Basic comment moderation.
- Live, offline, and ended broadcast states.
- Backend-controlled live-session access policies.

#### Quality and Release Preparation

- Complete testing of all core user workflows.
- Review security and access control.
- Improve error handling and user feedback.
- Verify desktop and mobile layouts.
- Configure and verify deployment.
- Complete project documentation and final demonstration.

### 4.3 Out of Scope for Release 1.0

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

| Alternative | Strength | Opportunity for BeyondMe |
|---|---|---|
| Website builders such as Wix | Convenient website creation and templates | Build a customized full-stack application |
| Publishing platforms such as Substack | Writing and publishing tools | Combine personal identity, hobbies, and live interaction |
| Streaming platforms such as YouTube Live | Established live-video features | Provide a more integrated personal website experience |
| Multiple separate social accounts | Familiar platforms and existing audiences | Bring personal content and community interaction together |

The goal is not to reproduce every feature of these services. It is to build a focused personal website that demonstrates a connected user experience and practical full-stack engineering.

## 6. Technical Architecture

### 6.1 Current Technology Stack

The implemented application currently uses:

- **Frontend:** HTML, CSS, and JavaScript.
- **Backend:** Node.js and Express.
- **Database:** MongoDB Atlas using the MongoDB Node.js Driver.
- **Authentication:** Password hashing with bcrypt and server-side session management.
- **Session Storage:** MongoDB-backed sessions using connect-mongo.
- **Image Upload:** Multer for handling uploaded journal images.
- **Environment Configuration:** dotenv and environment variables.
- **Version Control and Planning:** GitHub repository, issues, milestones, and branches.

### 6.2 Planned Live-Streaming Technology

The following technologies are proposed for the live community features:

- **Real-time Communication:** Socket.IO for live comments and related application events.
- **Live Video:** WebRTC publishing through a managed streaming provider with a Selective Forwarding Unit (SFU), subject to provider evaluation.
- **Streaming Authorization:** Backend-issued, short-lived and appropriately scoped credentials.
- **Future Authentication:** Secure server-side authentication and authorization when account features are introduced.

The live-video provider has not yet been selected. Provider selection is a prerequisite for finalizing the streaming implementation.

### 6.3 Current Application Architecture

The implemented website follows this general flow:

1. The browser loads the static frontend from the Express application.
2. The frontend uses `fetch()` to communicate with the Express API.
3. Express validates requests and reads or writes persistent data in MongoDB Atlas.
4. The admin dashboard communicates with protected administrative API endpoints.
5. The backend verifies the administrator's session before allowing authorized content-management operations.
6. Uploaded images are handled by the backend and stored in the application's upload directory.

### 6.4 Planned Live-Streaming Architecture

When live streaming is implemented, the application will extend the existing architecture:

1. The creator requests permission to start a broadcast.
2. The backend verifies the creator's authorization.
3. The backend obtains or issues appropriately scoped, short-lived streaming credentials through the selected provider's supported integration.
4. The creator's browser publishes camera and microphone media using WebRTC.
5. The streaming provider's SFU distributes the media to viewers.
6. Socket.IO delivers real-time comments to clients connected to the appropriate live-session room.
7. MongoDB stores session metadata and comment history.

### 6.5 Separation of Responsibilities

**Frontend**

- Display the website and published content.
- Provide the creator's admin interface.
- Request camera and microphone access when broadcasting is implemented.
- Display the creator's preview and live broadcast.
- Display comments and stream status.
- Show sign-in or access-denied interfaces when needed.

**Express Backend**

- Manage content and live sessions.
- Verify administrator and creator authorization.
- Apply viewing access policies.
- Manage authentication and authorization when accounts are introduced.
- Validate API requests.
- Protect streaming credentials and secrets.

**MongoDB Atlas**

- Store journal posts and content metadata.
- Store session metadata and access settings.
- Store comments and their associated session identifiers.
- Store user and authorization-related records if account features are introduced.

**Streaming Provider**

- Receive the creator's audio and video.
- Distribute live media to viewers.
- Enforce supported publishing and viewing access controls.

### 6.6 Live Video and Chat Are Separate Systems

WebRTC and the selected streaming provider will deliver the actual audio and video. Socket.IO will handle real-time comments and related application events. MongoDB will provide persistent storage.

Socket.IO alone does not distribute live video.

A managed SFU is proposed because it forwards the creator's media to multiple viewers without requiring the creator's browser to establish a separate media connection to every viewer.

The selected provider must be evaluated for browser support, public and restricted viewing, token security, pricing, usage limits, and deployment requirements.

## 7. Backend Design: Authentication and Access Control

### 7.1 Current Authentication

The implemented application provides administrator authentication for content management.

Current functionality includes:

- Administrator login.
- Password verification using bcrypt.
- Server-side session management.
- MongoDB-backed session storage.
- Protected administrative API routes.
- Administrator logout and session checks.

The current authentication system is intended for the website owner and does not mean that public visitor accounts have been implemented.

### 7.2 Authentication Versus Authorization

Authentication determines who a user is. Authorization determines which actions and resources that user may access.

The backend must enforce authorization independently of the frontend interface. Hiding a button or protecting a page visually is not sufficient.

### 7.3 Planned Release 1.0 Live-Streaming Access Rules

- Public visitors may watch public broadcasts without an account.
- Only the authorized creator may start or end a broadcast.
- Only the creator may publish video.
- Viewers cannot manage live sessions or access creator-only operations.
- Viewing credentials are issued through the backend's authorization flow.
- Streaming-provider secrets are never exposed in frontend JavaScript.

### 7.4 Future Access Modes

The backend should be designed to support these viewing modes:

| Access mode | Intended behavior |
|---|---|
| `public` | Anyone can watch the stream |
| `authenticated` | The viewer must sign in |
| `approved_users` | The viewer must sign in and have explicit permission |

The initial live-streaming experience will enable public viewing. The other modes will remain future capabilities until authentication and the corresponding authorization rules are implemented and tested.

A `members_only` mode may be added later if membership functionality is developed.

### 7.5 Planned Authorization Flow

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

### 7.6 Future Authentication Design

When public account functionality is introduced, the system will need:

- User registration and sign-in.
- Secure password handling if passwords are used.
- Server-side session management or another secure authentication mechanism.
- Appropriate cookie and session protections.
- Authorization checks on protected backend endpoints.
- A method for associating approved viewers with restricted sessions.
- Account and permission validation for moderation and other privileged operations.

These features will be implemented in a later milestone rather than being treated as complete in Release 1.0.

## 8. Live-Session Data Model

Each live-session record should contain the information necessary to manage a broadcast and its access policy.

### 8.1 Proposed `liveSessions` Collection

Proposed fields:

- `title`: the broadcast title.
- `status`: the broadcast state, such as `offline`, `live`, or `ended`.
- `accessMode`: the configured viewing policy.
- `creatorId`: the identity of the authorized creator.
- `providerRoomId`: the provider-specific room or session identifier, when applicable.
- `createdAt`: the session creation timestamp.
- `startedAt`: the broadcast start timestamp, when applicable.
- `endedAt`: the broadcast end timestamp, when applicable.

### 8.2 Access-Mode Values

- `public`
- `authenticated`
- `approved_users`

New sessions will default to `public` for the initial public-viewing experience.

The backend must validate access-mode values and enforce the selected policy. The stored field describes the intended policy; it does not replace server-side authorization.

Provider secrets, long-lived credentials, and publishing tokens must not be returned as ordinary public session data.

### 8.3 Proposed `liveComments` Collection

Each comment should be associated with its live session and contain appropriate metadata, such as:

- Session identifier.
- Comment text.
- Creation timestamp.
- Author identifier or display name, according to the implemented identity model.

The initial public-comment design may support visitors without requiring accounts, subject to moderation and rate limiting. Future authenticated comments can associate a comment with a verified account.

These collections are proposed for the live-streaming implementation and are not yet part of the completed application.

## 9. Security, Privacy, and Moderation

Security is part of the product's definition of done.

### 9.1 Current Security Foundation

The existing application includes:

- Environment-based configuration for sensitive settings.
- `.env` exclusion from source control.
- Password hashing for administrator authentication.
- Server-side administrator sessions.
- MongoDB-backed session storage.
- Protected administrator operations.
- File-upload size and file-type restrictions.

These controls provide a foundation but do not, by themselves, establish that the application is production-ready.

### 9.2 Creator Authorization

- Only the authorized creator can start or end a broadcast.
- Only the creator can publish video to the channel.
- Public viewers cannot obtain creator publishing credentials.
- Content-management and administrative endpoints require appropriate authorization.

### 9.3 Credential Management

- Store database credentials and provider secrets in environment variables or deployment secrets.
- Exclude `.env` files and private keys from source control.
- Never expose long-lived provider secrets in frontend JavaScript.
- Use short-lived, appropriately scoped credentials when supported by the provider.
- Avoid logging sensitive credentials.

### 9.4 Comment Moderation

- Validate comment content and impose reasonable length limits.
- Restrict moderation actions to authorized users.
- Allow the creator to remove inappropriate comments.
- Apply reasonable rate limits and basic spam prevention.
- Define clear community rules.
- Handle abusive behavior appropriately.

### 9.5 Privacy and Consent

- Request camera and microphone permissions through the browser.
- Clearly indicate when a broadcast is live and publicly accessible.
- Stop local camera and microphone tracks when the creator ends a broadcast.
- Clearly communicate whether recording is supported before implementing any recording feature.
- Avoid promising recording, replay, or privacy behavior that has not been implemented and tested.

### 9.6 Restricted Viewing Security

When account-based viewing is introduced:

- Enforce the configured access mode on the backend.
- Verify authentication and authorization before issuing viewing credentials.
- Use provider-supported controls to prevent unauthorized direct access.
- Do not rely on hidden pages or frontend-only checks.
- Test that unauthorized viewers cannot bypass access restrictions.

## 10. Definition of Done — KILO

Release 1.0 is complete when the following acceptance criteria have been satisfied.

The checkboxes below distinguish completed work from remaining requirements.

### 10.1 Website and Content

- [x] The personal-brand website and core navigation are implemented.
- [x] Visitors can explore the creator's identity and interests.
- [x] The journal page displays published content.
- [x] Journal content can be organized into categories.
- [x] The creator can create, edit, publish, unpublish, and delete journal posts through the admin dashboard.
- [x] Journal images can be uploaded and displayed.
- [x] Content persists in MongoDB Atlas.
- [x] The frontend and Express backend exchange JSON through working API endpoints.
- [x] Administrator login and session management are implemented.

### 10.2 Live Broadcasting

- [ ] A suitable streaming provider has been selected and integrated.
- [ ] The creator can request camera and microphone permissions and preview the media.
- [ ] The creator can start and stop a broadcast from the website.
- [ ] Unauthorized visitors cannot publish to the channel.
- [ ] Multiple public viewers can watch the same broadcast, subject to provider limits.
- [ ] The interface displays the correct live, offline, or ended state.
- [ ] The website handles denied permissions, unavailable streams, and connection failures.

### 10.3 Live Comments

- [ ] Viewers can submit comments during a broadcast.
- [ ] Comments appear for connected viewers without refreshing the page.
- [ ] Comments are associated with the correct live session.
- [ ] Recent comments can be retrieved from persistent storage.
- [ ] The creator can remove inappropriate comments.
- [ ] Basic input validation and rate limiting are implemented.

### 10.4 Backend and Security

- [x] Administrator-only content-management operations require authentication.
- [x] Environment variables are used for sensitive configuration.
- [x] `.env` and `node_modules` are excluded from source control.
- [ ] Creator-only live-broadcast operations are protected by backend authorization.
- [ ] Provider secrets are not committed to the repository or exposed in frontend code.
- [ ] The backend has a defined access-policy design for future restricted viewing.
- [ ] Public live viewing works without requiring an account.
- [x] Project documentation distinguishes implemented features from planned enhancements.

### 10.5 Quality and Deployment

- [ ] The complete application is deployed to an accessible environment.
- [ ] Required production secrets are configured securely.
- [ ] Core user flows are tested.
- [ ] Desktop and mobile layouts are checked.
- [ ] Setup instructions and architecture documentation are available.
- [ ] The final demonstration shows the website, content management, live broadcasting, public viewing, and comments.

Future account registration and restricted-viewing functionality will have separate acceptance criteria when that work is scheduled.

## 11. GitHub Milestones

The following milestones organize development into manageable stages.

1. [Personal Identity & Website Foundation](https://github.com/tuyetnguyenfl/mshotel/milestone/2)
2. [Blog & Content Management](https://github.com/tuyetnguyenfl/mshotel/milestone/3)
3. [Community & Live Streaming](https://github.com/tuyetnguyenfl/mshotel/milestone/4)
4. [User Testing & Security](https://github.com/tuyetnguyenfl/mshotel/milestone/5)
5. [Demo Ready & Release 1.0](https://github.com/tuyetnguyenfl/mshotel/milestone/6)

The first two milestones establish the website and content-management foundation. The remaining milestones focus on live community functionality, security, testing, and release preparation.

## 12. GitHub Issues and Implementation Order

The following issues define the initial live-streaming implementation sequence.

1. [Issue 1: Research and Select the Live Streaming Approach](https://github.com/tuyetnguyenfl/mshotel/issues/3)
2. [Issue 2: Implement Secure Live-Session Management](https://github.com/tuyetnguyenfl/mshotel/issues/4)
3. [Issue 3: Build Browser-Camera Broadcasting](https://github.com/tuyetnguyenfl/mshotel/issues/5)
4. [Issue 4: Build Public Live-Viewing Page](https://github.com/tuyetnguyenfl/mshotel/issues/6)

### Implementation Dependencies

**Issue 1 must be completed first.** The streaming-provider decision affects the architecture, credentials, session management, and integration requirements of the remaining issues.

The planned order is:

1. Research provider options and select a suitable streaming approach.
2. Implement backend live-session creation, status management, and authorization.
3. Build browser-based camera and microphone broadcasting.
4. Build the public live-viewing page and integrate the viewing experience.

Socket.IO comments, moderation, and additional security testing will be developed as part of the community and release milestones.

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
| Uploaded image persistence | Evaluate reliable persistent or object storage for production deployment |
| Project scope | Prioritize the minimum viable product and defer advanced features |

Important decisions still to be finalized include the streaming provider, expected operating costs, deployment configuration, and the exact implementation of future account-based viewing.

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

The `capstone-planning` branch contains the capstone planning document and the current BeyondMe implementation work.

The planning document must describe proposed features accurately and must not claim that a feature is implemented until it has been completed and verified.

## 16. Project Success Criteria

The project will be considered successful when:

- Visitors can understand the creator's identity and explore personal content.
- The creator can manage journal posts and hobby content.
- The creator can broadcast from the website using the browser's camera and microphone.
- Public visitors can watch the live stream without creating an account.
- Visitors can participate in real-time comments.
- The creator can control the broadcast and moderate the conversation.
- Data persists appropriately in MongoDB Atlas.
- The backend protects creator-only operations and streaming credentials.
- The application is deployed and its core workflows are demonstrated successfully.
- The repository documents requirements, implementation, testing, and release status.
- The architecture supports future account-based and restricted viewing without requiring a complete redesign.

**Final Objective:** Build a personal digital home that combines identity, publishing, and live community interaction in one secure, accessible, and extensible web application.