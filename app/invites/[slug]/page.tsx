import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";
import InviteView from "@/components/invite/InviteView";
import type { CustomColors } from "@/types/database";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("wedding_invites")
    .select("bride_name, groom_name, event_date, event_location, photo_1_url")
    .eq("unique_slug", slug)
    .single();

  if (!data) {
    return { title: "Invite Not Found" };
  }

  const title = `${data.bride_name} & ${data.groom_name} — Wedding Invitation`;
  const description = `You're invited to the wedding of ${data.bride_name} and ${data.groom_name}${
    data.event_date ? ` on ${new Date(data.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""
  }${data.event_location ? ` at ${data.event_location}` : ""}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: data.photo_1_url ? [{ url: data.photo_1_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.photo_1_url ? [data.photo_1_url] : [],
    },
  };
}

export default async function InvitePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: invite, error } = await supabase
    .from("wedding_invites")
    .select("*")
    .eq("unique_slug", slug)
    .single();

  if (error || !invite) {
    notFound();
  }

  return (
    <InviteView
      invite={invite}
      colors={(invite.custom_colors as CustomColors) ?? {
        primary: "#C9A84C",
        secondary: "#FAF7F2",
        accent: "#1C1C1E",
      }}
    />
  );
}
