import {
  getNotifications,
  markNotificationRead,
  Notification,
  streamNotifications,
} from 'api/notifications';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
type Value = {
  items: Notification[];
  unreadCount: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  liveNotification: Notification | null;
  dismissLiveNotification: () => void;
};
const Context = createContext<Value | undefined>(undefined);
export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnread] = useState(0);
  const [hasMore, setMore] = useState(false);
  const [liveNotification, setLiveNotification] = useState<Notification | null>(null);
  const merge = useCallback(
    (n: Notification) => setItems((old) => [n, ...old.filter((x) => x.id !== n.id)].slice(0, 20)),
    [],
  );
  useEffect(() => {
    const controller = new AbortController();
    let retry: number;
    const connect = () =>
      streamNotifications((n) => {
        merge(n);
        setLiveNotification(n);
        if (!n.readAt) setUnread((x) => x + 1);
      }, controller.signal).catch(() => {
        if (!controller.signal.aborted) retry = window.setTimeout(connect, 2000);
      });
    connect();
    void getNotifications().then((r) => {
      setItems(r.data.items);
      setUnread(r.data.unreadCount);
      setMore(r.data.hasMore);
    });
    return () => {
      controller.abort();
      window.clearTimeout(retry);
    };
  }, [merge]);
  const loadMore = async () => {
    const last = items[items.length - 1];
    if (!last || !hasMore) return;
    const r = await getNotifications(last.createdAt);
    setItems((old) => [...old, ...r.data.items.filter((x) => !old.some((y) => y.id === x.id))]);
    setMore(r.data.hasMore);
    setUnread(r.data.unreadCount);
  };
  const markRead = async (id: number) => {
    const r = await markNotificationRead(id);
    setItems((old) => old.map((x) => (x.id === id ? r.data : x)));
    setUnread((x) => Math.max(0, x - (items.find((x) => x.id === id)?.readAt ? 0 : 1)));
  };
  return (
    <Context.Provider
      value={{
        items,
        unreadCount,
        hasMore,
        loadMore,
        markRead,
        liveNotification,
        dismissLiveNotification: () => setLiveNotification(null),
      }}
    >
      {children}
    </Context.Provider>
  );
};
export const useNotifications = () => {
  const x = useContext(Context);
  if (!x) throw new Error('Missing NotificationProvider');
  return x;
};
