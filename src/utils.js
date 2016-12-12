const canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
)

const isServer = !canUseDOM;

export {
  isServer,
}
