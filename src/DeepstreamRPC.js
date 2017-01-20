import React, { Children, Component, PropTypes } from 'react';

import {
  isServer,
} from './utils';

class DeepstreamRPC extends Component {
  constructor(props) {
    super(props);

    const cacheKey = `${props.dsCall}-${JSON.stringify(props.dsData)}`;
    const cached = !isServer && window.__DS_RPC_CACHE__ && window.__DS_RPC_CACHE__[cacheKey];

    this.state = {
      isReady: cached,
      result: cached || {},
    }
  }

  componentWillMount() {
    isServer && this.makeCall();
  }

  componentDidMount() {
    this.makeCall();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.dsCall !== this.props.dsCall || nextProps.dsData !== this.props.dsData) {
      this.setState({
        isReady: false,
        result: null,
      })
      this.makeCall(nextProps);
    }
  }

  get ds() {
    return this.props.ds || this.context.ds;
  }

  makeCall(props) {
    props = props || this.props;

    const {
      dsCall,
      dsData,
      } = props;

    this.justCalled = true;
    this.ds.rpc.make(dsCall, dsData, this.callEnded);
    delete this.justCalled;
  }

  callEnded = (err, result) => {
    (this.justCalled || !isServer) && this.setState({
      isReady: true,
      result,
    });
  }

  render() {
    const {
      dsCall,
      dsData,
      children,
      ...otherProps,
      } = this.props;

    const {
      isReady,
      result,
      } = this.state;

    if (!isReady) {
      return null;
    }

    const onlyChild = Children.toArray(children).filter(child => child)[0];

    return React.cloneElement(Children.only(onlyChild), {
      ds:  this.ds,
      rpcResult: result,
      ...otherProps,
      ...onlyChild.props,
    });
  }
}

DeepstreamRPC.propTypes = {
  dsCall: PropTypes.string.isRequired,
}

DeepstreamRPC.contextTypes = {
  ds: PropTypes.object,
}

export default DeepstreamRPC;
