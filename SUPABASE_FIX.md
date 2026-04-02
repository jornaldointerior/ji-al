# Supabase Storage & Policy Fix (2026-04-02)

## Description
Fixed the error "Erro ao fazer upload da imagem" when publishing articles. The issue was due to missing storage bucket and RLS policies in Supabase.

## Applied Changes
1.  **Storage**: Created bucket `articles` and set to `public`.
2.  **RLS (Storage)**:
    *   `SELECT`: Added public read policy for `articles` bucket.
    *   `INSERT`: Added policies for `anon` and `authenticated` roles to allow uploads.
3.  **RLS (Database)**:
    *   `INSERT`: Added `Allow public insert` policy for the `public.articles` table to ensure article records can be saved.

## Verification
- Verified bucket exists in `storage.buckets`.
- Verified policies exist in `pg_policies`.
- Verified `articles` table schema matches expectations.
