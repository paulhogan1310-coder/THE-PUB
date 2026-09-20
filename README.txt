THE PUB V0.1 — shared backend
Uses Vercel Functions + Vercel Blob.

Vercel setup:
1. Add a Blob store to this project so BLOB_READ_WRITE_TOKEN is created.
2. Add environment variable PUB_ADMIN_TOKEN with this value:
hFUrXxMYkYoUktOHBX6V5TUt3ZJmyD-d
3. Redeploy.

Participant: https://YOUR_HOST/
Admin: https://YOUR_HOST/?admin=1
In Admin > Data, paste the same token once. It stays in localStorage on that device.

Acceptance test:
- Header says LIVE.
- Admin edit publishes and appears on participant within ~7 sec.
- Votes aggregate across devices.
- PRE-MATCH/LIVE/FULL-TIME state propagates.
