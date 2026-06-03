'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('notifications')
        .select('id, title, message, is_read, created_at')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      setNotifications((data ?? []) as NotificationItem[]);
      setLoading(false);

      channel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            const item = payload.new as NotificationItem;
            setNotifications((current) => [item, ...current]);
          },
        )
        .subscribe();
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { notifications, loading };
}
