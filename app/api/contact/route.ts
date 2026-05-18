import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  event_date: z.string().optional(),
  location: z.string().max(200).optional(),
  service_type: z.string().max(100).optional(),
  message: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Invalid form data" }, { status: 422 });
    }

    const { name, email, phone, event_date, location, service_type, message } = parsed.data;

    // Save to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from("enquiries").insert({
      name,
      email,
      phone: phone ?? null,
      event_date: event_date || null,
      location: location ?? null,
      service_type: service_type ?? null,
      message,
    });

    if (dbError) {
      console.error("[api/contact] Supabase insert error:", dbError);
      return Response.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    // Optional: send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "website@2soulfilms.com",
          to: ["2solu2018@gmail.com"],
          subject: `New enquiry from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone ?? "—"}`,
            `Service: ${service_type ?? "—"}`,
            `Event Date: ${event_date ?? "—"}`,
            `Location: ${location ?? "—"}`,
            `\nMessage:\n${message}`,
          ].join("\n"),
        }),
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
