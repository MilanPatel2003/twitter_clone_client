# Twitter Clone — Frontend Dev Guide

This is the step-by-step order to go from zero to fully wired frontend.
Follow each phase in order. Don't skip ahead.

---

## Phase 0 — Project Setup

```bash
npm install
npx shadcn@latest add button input label avatar card separator tabs dropdown-menu
```

Create `.env` in the root:
```
VITE_API_URL=http://localhost:3000/api
```

Run the dev server:
```bash
npm run dev
```

---

## Phase 1 — Auth (Do This First)

**Files involved:**
- `src/context/AuthContext.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/lib/api.ts`

**Steps:**

1. Open `AuthContext.tsx`. Right now it has a mock user. Replace it with the real version that calls the API (register, login, `/auth/me` on mount).

2. Test register at `/register` — check the network tab, make sure you get a token back.

3. Test login at `/login` — after login you should land on `/` (feed).

4. Open DevTools → Application → Local Storage. You should see `token` stored.

5. Refresh the page. You should stay logged in (because `useEffect` calls `/auth/me`).

6. Test logout from the sidebar dropdown.

**You know Phase 1 is done when:**
- Register works and saves token
- Login works and redirects to feed
- Refresh keeps you logged in
- Logout clears token and redirects to `/login`

---

## Phase 2 — Feed Page

**Files involved:**
- `src/hooks/useTweets.ts` → `useFeedTweets()`
- `src/pages/FeedPage.tsx`
- `src/components/tweet/TweetCard.tsx`

**Steps:**

1. Open `useFeedTweets` in `hooks/useTweets.ts`. The `api.get("/tweets/feed")` call is already there. Just make sure the response shape matches — your backend returns `res.data.tweets`.

2. Go to `/` in the browser. If your feed has tweets, they should show up.

3. If feed is empty (you just registered), go to Phase 3 first (create a tweet), then come back.

**You know Phase 2 is done when:**
- Tweets show up in the feed with avatar, name, content, timestamp
- Retweets show the "X retweeted" label above

---

## Phase 3 — Create a Tweet

**Files involved:**
- `src/components/tweet/TweetComposer.tsx`
- `src/hooks/useTweets.ts` → `createTweet()`

**Steps:**

1. The composer is already on the feed page. Type something and hit Tweet.

2. Check the network tab — it should POST to `/api/tweets` with `content` in the body.

3. If you're attaching media, it sends as `FormData`. Make sure your backend has multer set up for that endpoint.

4. After posting, the new tweet should appear at the top of the feed without a page refresh (optimistic prepend in `useFeedTweets`).

**You know Phase 3 is done when:**
- You can type and post a tweet
- It appears instantly at the top
- You can attach an image or video and it uploads

---

## Phase 4 — Like & Retweet

**Files involved:**
- `src/components/tweet/TweetCard.tsx` → `handleLike()`, `handleRetweet()`

**Steps:**

1. These are already inside `TweetCard.tsx` using local state. Click the heart — it should toggle and the count should update instantly (optimistic update, no hook needed).

2. Check network tab — it should hit `POST /api/reactions/tweets/:id` or `DELETE` depending on state.

3. Same for retweet — `POST /api/retweets/:id` or `DELETE`.

**You know Phase 4 is done when:**
- Heart turns pink and count goes up when you like
- Heart goes back when you unlike
- Retweet turns green and back
- Page refresh keeps the correct state (because it comes from the API on next load)

---

## Phase 5 — Tweet Detail + Comments

**Files involved:**
- `src/pages/TweetDetailPage.tsx`
- `src/components/comment/CommentList.tsx`
- `src/components/comment/CommentItem.tsx`

**Steps:**

1. Click any tweet card — it navigates to `/tweet/:id`.

2. The page fetches the tweet by ID and its comments in parallel.

3. Type in the comment box and hit Post. It calls `POST /api/comments/:tweetId`.

4. To reply to a comment, click Reply under any comment. It calls `POST /api/comments/reply/:commentId`.

5. Replies are collapsed by default. Click "View X replies" to expand (Instagram-style).

6. Delete your own comment with the Delete button.

**You know Phase 5 is done when:**
- Tweet detail page loads the tweet + comments
- You can post a comment
- You can reply to a comment and see it nested
- You can delete your own comments

---

## Phase 6 — Profile Page

**Files involved:**
- `src/pages/ProfilePage.tsx`
- `src/components/profile/ProfileHeader.tsx`
- `src/components/profile/ProfileTabs.tsx`

**Steps:**

1. Click any username or avatar anywhere — it navigates to `/:username`.

2. The page calls 4 endpoints in parallel:
   - `GET /api/users/:username` → profile info
   - `GET /api/users/:username/tweets` → tweets + retweets
   - `GET /api/users/:username/replies` → replies
   - `GET /api/users/:username/likes` → liked tweets

3. Check that your backend returns `isFollowing` in the profile response so the Follow button shows the right state.

4. Test Follow/Unfollow on someone else's profile.

5. On your own profile, the "Edit profile" button shows instead of Follow. (You can wire that up later.)

**You know Phase 6 is done when:**
- Profile page loads with cover image, avatar, bio
- Tweets / Replies / Likes tabs all show correct data
- Follow/Unfollow button works and toggles correctly
- Visiting your own profile shows "Edit profile"

---

## Phase 7 — Notifications

**Files involved:**
- `src/pages/NotificationsPage.tsx`

**Steps:**

1. Click the Bell icon in the sidebar → goes to `/notifications`.

2. It calls `GET /api/notifications`. Make sure your backend returns `actor` info nested in each notification (username, fullname, profile_image).

3. Click a notification to mark it as read — calls `PUT /api/notifications/:id/read`.

4. Click "Mark all as read" to bulk mark.

**You know Phase 7 is done when:**
- Notifications list loads with correct icons per type (like, follow, retweet, comment, reply)
- Unread notifications have a blue dot and light blue background
- Clicking marks as read

---

## Phase 8 — Polish (Do Last)

These are not needed to make the app work, but good to finish it off:

- **Edit Profile** — wire up `PUT /api/users/profile` with a modal or separate page
- **Profile image upload** — `PUT /api/users/profile-image` with multer
- **Cover image upload** — `PUT /api/users/cover-image`
- **Right column** — replace static trending/who-to-follow with real API data
- **Search** — not in backend yet, skip for now
- **Follower/Following counts** — add to profile header from `GET /follows/:userId/followers`

---

## File → API Map (Quick Reference)

| File | API Endpoint |
|------|-------------|
| `AuthContext.tsx` | `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout` |
| `hooks/useTweets.ts` | `/tweets/feed`, `/tweets`, `/users/:username/tweets` |
| `TweetCard.tsx` | `/reactions/tweets/:id`, `/retweets/:id` |
| `TweetDetailPage.tsx` | `/tweets/:id`, `/comments/tweet/:id` |
| `CommentList.tsx` | `/comments/:tweetId`, `/comments/reply/:commentId` |
| `ProfilePage.tsx` | `/users/:username`, `/users/:username/tweets`, `/users/:username/replies`, `/users/:username/likes` |
| `ProfileHeader.tsx` | `/follows/:userId` |
| `NotificationsPage.tsx` | `/notifications`, `/notifications/:id/read` |

---

## Common Issues

**Tweets not showing on feed**
→ You probably have no follows yet. Follow someone first, then their tweets appear.

**Token not sending**
→ Check `lib/api.ts` interceptor. Make sure `localStorage.getItem("token")` returns something.

**CORS error**
→ Add `cors` middleware in your Express backend with `origin: "http://localhost:5173"`.

**Comment replies not nesting**
→ Your backend needs to return `replies: []` nested inside each comment, or you fetch them separately per comment. Check `GET /comments/reply/:commentId`.

**Images not loading**
→ Make sure ImageKit URLs are being returned from the backend in `media_url`. The frontend just renders whatever URL it gets.