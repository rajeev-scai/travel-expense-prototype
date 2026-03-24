export const Fmt = {
  currency(n, currency = '₹') {
    return `${currency}${Number(n).toLocaleString('en-IN')}`;
  },
  date(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  dateShort(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  },
  time(d) {
    return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },
  km(n) {
    return `${Number(n).toFixed(1)} km`;
  },
};
