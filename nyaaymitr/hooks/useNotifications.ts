'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  user_id?: string;
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

      const userId = userData.user.id;
      const { data } = await supabase
        .from('notifications')
        .select('id, title, body, is_read, created_at, user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setNotifications((data ?? []) as NotificationItem[]);
      setLoading(false);

      channel = supabase
        .channel('user-notifications-' + userId)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: 'user_id=eq.' + userId,
          },
          (payload) => {
            const item = payload.new as NotificationItem;
            if (item.id) setNotifications((current) => [item, ...current]);
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
