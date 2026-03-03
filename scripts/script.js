/**
 * Utility functions – pure, functional, and well‑documented.
 */

/**
 * Checks if a value is a plain object (excluding arrays and null).
 * @param {*} value
 * @returns {boolean}
 */
const isPlainObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Performs a deep clone of plain objects and arrays.
 * Primitive values are returned as‑is.
 *
 * @param {*} source
 * @returns {*}
 */
function deepClone(source) {
  if (!isPlainObject(source) && !Array.isArray(source)) {
    return source;
  }

  const clone = Array.isArray(source) ? [] : {};
  for (const [key, val] of Object.entries(source)) {
    clone[key] = deepClone(val);
  }
  return clone;
}

/**
 * Creates a debounced version of the supplied function.
 *
 * @param {Function} fn   Function to debounce.
 * @param {number}   wait Milliseconds to wait after the last call.
 * @returns {Function}
 */
function debounce(fn, wait) {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Creates a throttled version of the supplied function.
 *
 * @param {Function} fn   Function to throttle.
 * @param {number}   limit Minimum time (ms) between calls.
 * @returns {Function}
 */
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/* -------------------------- Example usage -------------------------- */

// Deep clone demonstration
const original = {
  name: 'Alice',
  address: { city: 'Wonderland', zip: 12345 },
  tags: ['curious', 'brave']
};

const copy = deepClone(original);
copy.address.city = 'Looking Glass';
copy.tags.push('smart');

console.log('Original:', original);
console.log('Copy:', copy);

// Debounce demo (logs only once after the user stops resizing the window)
const onResize = debounce(() => console.log('Window resized'), 300);
window.addEventListener('resize', onResize);

// Throttle demo (logs at most once every 500 ms while scrolling)
const onScroll = throttle(() => console.log('Scrolling...'), 500);
window.addEventListener('scroll', onScroll);