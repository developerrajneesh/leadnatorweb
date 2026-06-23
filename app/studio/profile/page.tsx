"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiCamera, FiSave, FiUser } from "react-icons/fi";
import StudioShell from "@/components/studio/StudioShell";
import { shouldUnoptimizeImage } from "@/lib/blog/media";
import type { BlogAuthorProfile } from "@/lib/blog/author-profile";

const EMPTY: BlogAuthorProfile = {
  displayName: "",
  role: "",
  bio: "",
  avatarUrl: "",
  initials: "",
};

export default function StudioProfilePage() {
  const [profile, setProfile] = useState<BlogAuthorProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/studio/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProfile(data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/studio/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setProfile((p) => ({ ...p, avatarUrl: data.file.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/studio/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      setProfile(data);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  function removeAvatar() {
    setProfile((p) => ({ ...p, avatarUrl: "" }));
  }

  const previewInitials =
    profile.initials ||
    profile.displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ||
    "LN";

  return (
    <StudioShell
      title="Author profile"
      subtitle="This picture and info appear on your blog posts — Written by section"
    >
      {loading ? (
        <p className="studio-loading">Loading profile…</p>
      ) : (
        <form className="sp" onSubmit={save}>
          <div className="sp-card sp-card-photo">
            <div className="sp-photo-wrap">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || "Author photo"}
                  width={120}
                  height={120}
                  className="sp-photo-img"
                  unoptimized={shouldUnoptimizeImage(profile.avatarUrl)}
                />
              ) : (
                <span className="sp-photo-fallback" aria-hidden>{previewInitials}</span>
              )}
              <label className="sp-photo-upload">
                <FiCamera aria-hidden />
                {uploading ? "Uploading…" : "Change photo"}
                <input type="file" accept="image/*" hidden onChange={uploadAvatar} disabled={uploading} />
              </label>
            </div>
            <div className="sp-photo-copy">
              <h2>Profile picture</h2>
              <p>Shown on every blog post next to your name — byline and Written by card.</p>
              {profile.avatarUrl ? (
                <button type="button" className="sp-link-btn" onClick={removeAvatar}>
                  Remove photo
                </button>
              ) : null}
            </div>
          </div>

          <div className="sp-card">
            <div className="sp-card-head">
              <FiUser aria-hidden />
              <div>
                <h2>Public author info</h2>
                <p>What readers see at the top and bottom of your articles</p>
              </div>
            </div>

            <label className="sp-field">
              <span>Display name</span>
              <input
                value={profile.displayName}
                onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                placeholder="Leadnator Team"
                required
              />
            </label>

            <label className="sp-field">
              <span>Role / title</span>
              <input
                value={profile.role}
                onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                placeholder="Content & Growth"
              />
            </label>

            <label className="sp-field">
              <span>Initials (if no photo)</span>
              <input
                value={profile.initials}
                onChange={(e) => setProfile((p) => ({ ...p, initials: e.target.value.toUpperCase().slice(0, 3) }))}
                placeholder="LN"
                maxLength={3}
              />
            </label>

            <label className="sp-field">
              <span>Short bio</span>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell readers who you are…"
              />
            </label>
          </div>

          {error ? <p className="studio-error">{error}</p> : null}
          {saved ? <p className="sp-saved">Profile saved — check any published blog post to see updates.</p> : null}

          <div className="sp-actions">
            <button type="submit" className="ln-btn ln-btn-primary" disabled={saving || uploading}>
              <FiSave aria-hidden /> {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      )}
    </StudioShell>
  );
}
