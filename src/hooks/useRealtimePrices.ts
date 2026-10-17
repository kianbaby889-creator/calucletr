import { useState, useEffect, useRef, useCallback } from 'react';
import { AllMarketPrices, CityId, ResourceType } from '../types/albion';
import { DEFAULT_MARKET_PRICES } from '../data/constants';
import {
  getSupabaseClient,
  subscribeToSupabasePriceChanges,
  syncPriceToSupabase
} from '../services/supabaseClient';

export interface LiveActivity {
  id: string;
  message: string;
  timestamp: number;
}

export function useRealtimePrices() {
  const [prices, setPrices] = useState<AllMarketPrices>(() => {
    let base = JSON.parse(JSON.stringify(DEFAULT_MARKET_PRICES));
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('albion_prices_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          for (const res of Object.keys(DEFAULT_MARKET_PRICES) as ResourceType[]) {
            for (const city of Object.keys(DEFAULT_MARKET_PRICES[res]) as CityId[]) {
              if (parsed[res]?.[city]) {
                base[res][city] = { ...base[res][city], ...parsed[res][city] };
              }
            }
          }
          return base;
        }
      } catch (e) {}
    }
    return base;
  });

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [crafterName, setCrafterName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('albion_crafter_name') || `Crafter_${Math.floor(1000 + Math.random() * 9000)}`;
    }
    return 'Crafter';
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addActivity = useCallback((message: string) => {
    setLiveActivities(prev => [
      { id: `${Date.now()}_${Math.random()}`, message, timestamp: Date.now() },
      ...prev.slice(0, 9)
    ]);
  }, []);

  const updateCrafterName = useCallback((name: string) => {
    const clean = name.trim() || 'Crafter';
    setCrafterName(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem('albion_crafter_name', clean);
    }
  }, []);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus('connected');
        console.log('[WS] Connected to Albion live synchronization server');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INIT_STATE') {
            if (data.payload?.prices) {
              setPrices(prev => {
                const updated = JSON.parse(JSON.stringify(prev));
                const incoming = data.payload.prices;
                for (const res of Object.keys(DEFAULT_MARKET_PRICES) as ResourceType[]) {
                  for (const city of Object.keys(DEFAULT_MARKET_PRICES[res]) as CityId[]) {
                    if (incoming[res]?.[city]) {
                      updated[res][city] = { ...updated[res][city], ...incoming[res][city] };
                    }
                  }
                }
                return updated;
              });
            }
            if (typeof data.payload?.onlineCount === 'number') {
              setOnlineCount(data.payload.onlineCount);
            }
          } else if (data.type === 'PRESENCE_UPDATE') {
            if (typeof data.payload?.onlineCount === 'number') {
              setOnlineCount(data.payload.onlineCount);
            }
          } else if (data.type === 'PRICE_CHANGED') {
            const { resource, city, field, value, updatedBy } = data.payload;
            setPrices(prev => {
              const updated = {
                ...prev,
                [resource]: {
                  ...prev[resource],
                  [city]: {
                    ...prev[resource][city],
                    [field]: value,
                    lastUpdated: Date.now(),
                    updatedBy
                  }
                }
              };
              try {
                localStorage.setItem('albion_prices_cache', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });

            addActivity(`${updatedBy || 'A crafter'} updated ${city} ${field} to ${value} Silver`);
          } else if (data.type === 'FULL_STATE_SYNC') {
            if (data.payload?.prices) {
              setPrices(data.payload.prices);
              try {
                localStorage.setItem('albion_prices_cache', JSON.stringify(data.payload.prices));
              } catch (e) {}
              addActivity(data.payload.reset ? 'All city prices were reset to default Albion values' : 'Prices synced with server');
            }
          }
        } catch (e) {
          console.error('[WS] Parse error on incoming message:', e);
        }
      };

      socket.onclose = () => {
        setConnectionStatus('offline');
        // Auto-reconnect after 3 seconds
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      socket.onerror = () => {
        setConnectionStatus('offline');
      };
    } catch (e) {
      console.error('[WS] Connection error:', e);
      setConnectionStatus('offline');
    }
  }, [addActivity]);

  useEffect(() => {
    connectWebSocket();

    // Also fetch initial state via REST as fallback
    fetch('/api/prices')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setPrices(prev => {
            const updated = JSON.parse(JSON.stringify(prev));
            const incoming = res.data;
            for (const resKey of Object.keys(DEFAULT_MARKET_PRICES) as ResourceType[]) {
              for (const city of Object.keys(DEFAULT_MARKET_PRICES[resKey]) as CityId[]) {
                if (incoming[resKey]?.[city]) {
                  updated[resKey][city] = { ...updated[resKey][city], ...incoming[resKey][city] };
                }
              }
            }
            return updated;
          });
          if (res.onlineCount) setOnlineCount(res.onlineCount);
        }
      })
      .catch(() => {});

    // Subscribe to Supabase real-time if configured
    const unsubscribeSupabase = subscribeToSupabasePriceChanges((payload) => {
      setPrices(prev => ({
        ...prev,
        [payload.resource]: {
          ...prev[payload.resource],
          [payload.city]: {
            ...prev[payload.resource][payload.city],
            [payload.field]: payload.value,
            lastUpdated: Date.now(),
            updatedBy: payload.updatedBy
          }
        }
      }));
      addActivity(`[Supabase] ${payload.updatedBy || 'User'} updated ${payload.city} ${payload.field}: ${payload.value}`);
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      unsubscribeSupabase();
    };
  }, [connectWebSocket, addActivity]);

  const updatePrice = useCallback((
    resource: ResourceType,
    city: CityId,
    field: keyof CityPriceData,
    value: number
  ) => {
    const numValue = Math.max(0, Math.round(value));

    // 1. Optimistic local update
    setPrices(prev => {
      const next = {
        ...prev,
        [resource]: {
          ...prev[resource],
          [city]: {
            ...prev[resource][city],
            [field]: numValue,
            lastUpdated: Date.now(),
            updatedBy: crafterName
          }
        }
      };
      try {
        localStorage.setItem('albion_prices_cache', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 2. Broadcast via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'UPDATE_PRICE',
        payload: {
          resource,
          city,
          field,
          value: numValue,
          updatedBy: crafterName
        }
      }));
    } else {
      // Fallback to HTTP POST
      fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource, city, field, value: numValue, updatedBy: crafterName })
      }).catch(() => {});
    }

    // 3. Sync to Supabase if configured
    if (getSupabaseClient()) {
      syncPriceToSupabase(resource, city, field, numValue, crafterName);
    }
  }, [crafterName]);

  // Reset prices to defaults
  const resetPrices = useCallback(() => {
    setPrices(DEFAULT_MARKET_PRICES);
    try {
      localStorage.setItem('albion_prices_cache', JSON.stringify(DEFAULT_MARKET_PRICES));
    } catch (e) {}

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'RESET_PRICES' }));
    } else {
      fetch('/api/prices/reset', { method: 'POST' }).catch(() => {});
    }
    addActivity('Reset all prices to Albion Royal defaults');
  }, [addActivity]);

  return {
    prices,
    updatePrice,
    resetPrices,
    connectionStatus,
    onlineCount,
    crafterName,
    updateCrafterName,
    liveActivities
  };
}
