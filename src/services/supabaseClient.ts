import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { AllMarketPrices, CityId, ResourceType } from '../types/albion';

let supabaseInstance: SupabaseClient | null = null;
let activeChannel: RealtimeChannel | null = null;

const STORAGE_KEY_URL = 'albion_supabase_url';
const STORAGE_KEY_ANON = 'albion_supabase_anon_key';

export function getSavedSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const savedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) || '' : '';

  return {
    url: savedUrl || envUrl,
    anonKey: savedKey || envKey
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
  if (activeChannel) {
    activeChannel.unsubscribe();
    activeChannel = null;
  }
  supabaseInstance = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSavedSupabaseConfig();
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: { persistSession: false }
      });
      return supabaseInstance;
    } catch (e) {
      console.error('[Supabase] Failed to initialize client:', e);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await testClient.from('albion_prices').select('resource').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but "albion_prices" table was not found. Please run the SQL schema script provided below.'
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected and verified albion_prices table!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

export function subscribeToSupabasePriceChanges(
  onUpdate: (payload: { resource: ResourceType; city: CityId; field: string; value: number; updatedBy?: string }) => void
) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  if (activeChannel) {
    activeChannel.unsubscribe();
  }

  activeChannel = client
    .channel('public:albion_prices')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'albion_prices' },
      (payload) => {
        const record = payload.new as any;
        if (record && record.resource && record.city) {
          onUpdate({
            resource: record.resource,
            city: record.city,
            field: record.field,
            value: Number(record.value),
            updatedBy: record.updated_by
          });
        }
      }
    )
    .subscribe();

  return () => {
    if (activeChannel) {
      activeChannel.unsubscribe();
      activeChannel = null;
    }
  };
}

export async function syncPriceToSupabase(
  resource: ResourceType,
  city: CityId,
  field: string,
  value: number,
  updatedBy: string
) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client.from('albion_prices').upsert({
      id: `${resource}_${city}_${field}`,
      resource,
      city,
      field,
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Supabase] Error syncing price:', err);
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.albion_prices (
  id TEXT PRIMARY KEY,
  resource TEXT NOT NULL,
  city TEXT NOT NULL,
  field TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  updated_by TEXT DEFAULT 'Crafter',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable real-time replication for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.albion_prices;

-- Allow public read/write (for collaborative gaming calculator)
ALTER TABLE public.albion_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.albion_prices FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.albion_prices FOR ALL USING (true);
`;
