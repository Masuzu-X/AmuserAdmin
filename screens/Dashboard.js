import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const DAY_MS = 24 * 60 * 60 * 1000;
const ONLINE_WINDOW_MS = 5 * 60 * 1000;
const CHART_DAYS = 7;

function toDateSafe(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function dateKey(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);
}

function buildLastDayKeys(days) {
  const now = new Date();
  const keys = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * DAY_MS);
    keys.push(dateKey(d));
  }
  return keys;
}

function dayLabel(key) {
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

function MetricCard({ label, value, tone = 'default' }) {
  return (
    <View style={[styles.metricCard, tone === 'accent' ? styles.metricCardAccent : null]}>
      <Text style={[styles.metricLabel, tone === 'accent' ? styles.metricLabelAccent : null]}>{label}</Text>
      <Text style={[styles.metricValue, tone === 'accent' ? styles.metricValueAccent : null]}>{value}</Text>
    </View>
  );
}

function MiniBarChart({ title, subtitle, data, barColor }) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Text style={styles.chartSubtitle}>{subtitle}</Text>
      <View style={styles.chartBarsRow}>
        {data.map((item) => {
          const heightPct = Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 2);
          return (
            <View key={item.label} style={styles.chartBarWrap}>
              <Text style={styles.chartValue}>{item.value}</Text>
              <View style={styles.chartTrack}>
                <View style={[styles.chartFill, { height: `${heightPct}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.chartLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [active24h, setActive24h] = useState(0);
  const [active7d, setActive7d] = useState(0);
  const [onlineNow, setOnlineNow] = useState(0);
  const [totalUsersSeries, setTotalUsersSeries] = useState([]);
  const [activeUsersSeries, setActiveUsersSeries] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const usersSnap = await getDocs(collection(db, 'users'));
        const now = Date.now();
        const lastDayCutoff = now - DAY_MS;
        const last7DaysCutoff = now - DAY_MS * 7;
        const onlineCutoff = now - ONLINE_WINDOW_MS;

        const keys = buildLastDayKeys(CHART_DAYS);
        const startDate = new Date(`${keys[0]}T00:00:00`);

        const createdByDay = {};
        const activeByDay = {};
        let baseBeforeWindow = 0;
        let total = 0;
        let users24h = 0;
        let users7d = 0;
        let online = 0;

        usersSnap.forEach((doc) => {
          total += 1;
          const data = doc.data();
          const createdAt = toDateSafe(data.createdAt);
          const updatedAt = toDateSafe(data.updatedAt);

          if (createdAt) {
            if (createdAt < startDate) {
              baseBeforeWindow += 1;
            } else {
              const createdKey = dateKey(createdAt);
              if (keys.includes(createdKey)) {
                createdByDay[createdKey] = (createdByDay[createdKey] || 0) + 1;
              }
            }
          }

          if (updatedAt) {
            const updatedMs = updatedAt.getTime();
            if (updatedMs >= lastDayCutoff) users24h += 1;
            if (updatedMs >= last7DaysCutoff) users7d += 1;
            if (updatedMs >= onlineCutoff) online += 1;

            const updatedKey = dateKey(updatedAt);
            if (keys.includes(updatedKey)) {
              activeByDay[updatedKey] = (activeByDay[updatedKey] || 0) + 1;
            }
          }
        });

        let runningTotal = baseBeforeWindow;
        const totalSeries = keys.map((k) => {
          runningTotal += createdByDay[k] || 0;
          return { label: dayLabel(k), value: runningTotal };
        });
        const activeSeries = keys.map((k) => ({
          label: dayLabel(k),
          value: activeByDay[k] || 0,
        }));

        if (!mounted) return;
        setTotalUsers(total);
        setActive24h(users24h);
        setActive7d(users7d);
        setOnlineNow(online);
        setTotalUsersSeries(totalSeries);
        setActiveUsersSeries(activeSeries);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#6b130f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorTitle}>Dashboard</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        <MetricCard label="Total Users" value={totalUsers} />
        <MetricCard label="Active Users (24h)" value={active24h} />
        <MetricCard label="Active Users (7d)" value={active7d} />
        <MetricCard label="Online Now" value={onlineNow} tone="accent" />
      </View>

      <View style={styles.chartsRow}>
        <MiniBarChart
          title="Total Users"
          subtitle="Cumulative growth over last 7 days"
          data={totalUsersSeries}
          barColor="#6b130f"
        />
        <MiniBarChart
          title="Active Users"
          subtitle="Users active per day (last 7 days)"
          data={activeUsersSeries}
          barColor="#1b7f79"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  loaderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  errorText: {
    color: '#87898b',
    fontSize: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    minWidth: 170,
    flexGrow: 1,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  metricCardAccent: {
    backgroundColor: '#6b130f',
    borderColor: '#6b130f',
  },
  metricLabel: {
    fontSize: 12,
    color: '#87898b',
    fontWeight: '600',
    marginBottom: 6,
  },
  metricLabelAccent: {
    color: 'rgba(255,255,255,0.8)',
  },
  metricValue: {
    fontSize: 28,
    color: '#1a1a1a',
    fontWeight: '800',
  },
  metricValueAccent: {
    color: '#ffffff',
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chartCard: {
    minWidth: 340,
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#87898b',
    marginTop: 2,
    marginBottom: 12,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  chartBarWrap: {
    flex: 1,
    alignItems: 'center',
  },
  chartValue: {
    fontSize: 11,
    color: '#5a5d60',
    marginBottom: 4,
    fontWeight: '600',
  },
  chartTrack: {
    width: '100%',
    maxWidth: 42,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#edf0f3',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartFill: {
    width: '100%',
    borderRadius: 10,
  },
  chartLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#7b7e81',
    fontWeight: '600',
  },
});
