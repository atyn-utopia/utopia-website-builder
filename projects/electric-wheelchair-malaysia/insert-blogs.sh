#!/bin/bash
API="https://xzydvhzcngpxdbyniliy.supabase.co/rest/v1"
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eWR2aHpjbmdweGRieW5pbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NTA3MjQsImV4cCI6MjA5MDIyNjcyNH0.xI-ddbidRRzxiYCLRUmcmKvLexOwAjiuWbTgkd8gi-k"
H1="apikey: $KEY"
H2="Authorization: Bearer $KEY"
H3="Content-Type: application/json"

# Test: insert one master post
RESULT=$(curl -s -X POST "$API/blog_posts" \
  -H "$H1" -H "$H2" -H "$H3" \
  -H "Prefer: return=representation" \
  -d '{"website":"electric-wheelchair.com.my","slug":"test-post","status":"draft","cover_image_url":"https://placehold.co/800x400"}')

echo "Insert test result: $RESULT"
