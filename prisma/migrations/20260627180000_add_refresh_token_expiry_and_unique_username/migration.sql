-- Existing refresh tokens predate the expires_at column and have no known
-- expiry; clear them so affected sessions simply need to log in again.
DELETE FROM "refresh_token";

-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN "expires_at" TIMESTAMPTZ(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
