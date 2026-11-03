-- Drop podcast tables. Episodes are managed in the content repository.
DROP TABLE IF EXISTS "public"."PodcastAccess";
DROP TABLE IF EXISTS "public"."PodcastCategory";
DROP TABLE IF EXISTS "public"."Podcast";
DROP TYPE IF EXISTS "public"."PodcastStatus";
DROP TYPE IF EXISTS "public"."PodcastType";
