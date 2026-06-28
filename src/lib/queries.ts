import { supabaseClient } from "./supabase/client";
import type { Contact, Event, Game, GalleryItem, Pricing, Promotion, Setting } from "./types";

export async function getGames(): Promise<Game[]> {
  const { data } = await supabaseClient
    .from("games")
    .select("*")
    .eq("active", true)
    .order("title");
  return data ?? [];
}

export async function getPricing(): Promise<Pricing[]> {
  const { data } = await supabaseClient
    .from("pricing")
    .select("*")
    .eq("active", true)
    .order("price");
  return data ?? [];
}

export async function getPromotions(): Promise<Promotion[]> {
  const { data } = await supabaseClient
    .from("promotions")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGallery(): Promise<GalleryItem[]> {
  const { data } = await supabaseClient
    .from("gallery")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getContacts(): Promise<Contact[]> {
  const { data } = await supabaseClient.from("contacts").select("*");
  return data ?? [];
}

export async function getEvents(): Promise<Event[]> {
  const { data } = await supabaseClient
    .from("events")
    .select("*")
    .eq("active", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date");
  return data ?? [];
}

export async function getSettings(): Promise<Record<string, string>> {
  const { data } = await supabaseClient.from("settings").select("*");
  const result: Record<string, string> = {};
  (data as Setting[] ?? []).forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
}
