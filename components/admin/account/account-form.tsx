"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOwnProfile } from "@/app/(admin)/admin/(protected)/account/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { CoverImageField } from "@/components/admin/media/cover-image-field";

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" size="sm" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function AccountForm({
  initial,
}: {
  initial: { email: string; role: string; name: string | null; avatar_url: string | null };
}) {
  const router = useRouter();
  const [state, action] = useActionState(updateOwnProfile, null);
  const [name, setName] = useState(initial.name ?? "");
  const [avatar, setAvatar] = useState(initial.avatar_url ?? "");

  useEffect(() => {
    if (state?.ok) {
      toast.success("Profile saved");
      router.refresh();
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Email" hint="Change your sign-in email via Supabase Auth.">
            <Input value={initial.email} readOnly disabled className="opacity-70" />
          </FormField>
          <FormField label="Role">
            <Input value={initial.role} readOnly disabled className="opacity-70" />
          </FormField>
          <FormField label="Display name">
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </FormField>
          <CoverImageField
            name="avatar_url"
            label="Avatar"
            variant="avatar"
            hint="Upload a photo from your device, pick from the media library, or paste an image URL."
            value={avatar}
            onChange={setAvatar}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SaveBtn />
      </div>
    </form>
  );
}
