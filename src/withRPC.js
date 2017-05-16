import PropTypes from 'prop-types';
import React from 'react';
import DeepstreamRPC from './DeepstreamRPC';

const withRPC =
  (WrappedComponent, dsCall, dsData) => {
    const Component = (props, context) => {
      const ds = props.ds || context.ds;

      return (
        <DeepstreamRPC ds={ ds } dsCall={ props.dsCall || dsCall } dsData={ props.dsData || dsData }>
          <WrappedComponent { ...props } />
        </DeepstreamRPC>
      )
    }

    Component.contextTypes = {
      ds: PropTypes.object,
    }

    return Component;
  }

export default withRPC;
