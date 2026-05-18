export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      photographer_profiles: {
        Row: {
          id: string;
          business_name: string;
          email: string;
          portfolio_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["photographer_profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["photographer_profiles"]["Insert"]
        >;
      };
      invite_templates: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          category: string | null;
          color_palette: Json | null;
          slide_1_hero_bg_url: string | null;
          slide_2_venue_bg_url: string | null;
          slide_3_story_bg_url: string | null;
          slide_4_closing_bg_url: string | null;
          is_active: boolean;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["invite_templates"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["invite_templates"]["Insert"]
        >;
      };
      wedding_invites: {
        Row: {
          id: number;
          unique_slug: string;
          created_by: string;
          template_id: number | null;
          bride_name: string;
          groom_name: string;
          event_date: string;
          event_time: string | null;
          event_location: string | null;
          venue_name: string | null;
          couple_story: string | null;
          custom_colors: Json | null;
          photo_1_url: string | null;
          photo_2_url: string | null;
          slide_1_url: string | null;
          slide_2_url: string | null;
          slide_3_url: string | null;
          slide_4_url: string | null;
          rsvp_info: Json | null;
          view_count: number;
          created_at: string;
          updated_at: string;
          shared_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["wedding_invites"]["Row"],
          "id" | "view_count" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["wedding_invites"]["Insert"]
        >;
      };
      invite_pageviews: {
        Row: {
          id: number;
          invite_id: number;
          viewed_at: string;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["invite_pageviews"]["Row"],
          "id" | "viewed_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["invite_pageviews"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_view_count: {
        Args: { invite_slug: string };
        Returns: void;
      };
    };
  };
}

export type WeddingInvite =
  Database["public"]["Tables"]["wedding_invites"]["Row"];
export type InviteInsert =
  Database["public"]["Tables"]["wedding_invites"]["Insert"];
export type PhotographerProfile =
  Database["public"]["Tables"]["photographer_profiles"]["Row"];
export type InviteTemplate =
  Database["public"]["Tables"]["invite_templates"]["Row"];

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface RsvpInfo {
  phone?: string;
  email?: string;
  website?: string;
}
