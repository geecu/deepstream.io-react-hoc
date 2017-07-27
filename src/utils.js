const canUseDOM = !!(
  (typeof window !== 'undefined' &&
   window.document && window.document.createElement)
)

const isServer = !canUseDOM;

const onConnect = (ds, cb) => {
  const isOpen = () => ds.getConnectionState() === ds.CONSTANTS.CONNECTION_STATE.OPEN;

  if (isOpen()) {
    cb();
  } else {
    const retry = () => {
      if (!isOpen()) {
        return;
      }

      ds.removeListener('connectionStateChanged', retry);

      cb();
    }

    ds.on('connectionStateChanged', retry);

  }
}

export {
  isServer,
  onConnect,
}
