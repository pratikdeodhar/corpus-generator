import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logEvent = async (eventType: string, eventData: any = {}) => {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert([
        { 
          event_type: eventType, 
          event_data: eventData 
        }
      ]);
    
    if (error) throw error;
  } catch (err) {
    console.error('Error logging event:', err);
  }
};
