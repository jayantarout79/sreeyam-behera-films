import { z } from "zod";

export const inviteSchema = z.object({
  bride_name: z.string().min(1, "Bride's name is required").max(100),
  groom_name: z.string().min(1, "Groom's name is required").max(100),
  event_date: z.string().min(1, "Event date is required"),
  event_time: z.string().optional(),
  event_location: z.string().max(500).optional(),
  venue_name: z.string().max(255).optional(),
  couple_story: z.string().max(2000).optional(),
  rsvp_phone: z.string().max(20).optional(),
  rsvp_email: z.string().email("Invalid RSVP email").optional().or(z.literal("")),
  template_id: z.number().int().optional(),
  custom_colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
    })
    .optional(),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;
