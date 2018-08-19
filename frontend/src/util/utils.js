Date.prototype.toISOStringWithTimezone = function() {
  const timeZoneOffset = -this.getTimezoneOffset();
  const difference = timeZoneOffset >= 0 ? '+' : '-';

  const pad = (num) => {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };

  return this.getFullYear() +
    '-' + pad(this.getMonth() + 1) +
    '-' + pad(this.getDate()) +
    'T' + pad(this.getHours()) +
    ':' + pad(this.getMinutes()) +
    ':' + pad(this.getSeconds()) +
    difference + pad(timeZoneOffset / 60) +
    ':' + pad(timeZoneOffset % 60);
};
