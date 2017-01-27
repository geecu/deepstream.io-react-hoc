import React, {
  PropTypes,
} from 'react';
import DeepstreamList from './DeepstreamList';

const withList =
  (WrappedComponent, dsList) => {
    const Component = (props, context) => {
      const ds = props.ds || context.ds;

      return (
        <DeepstreamList ds={ ds } dsList={ props.dsList || dsList }>
          <WrappedComponent { ...props } />
        </DeepstreamList>
      )
    }

    Component.contextTypes = {
      ds: PropTypes.object,
    }

    return Component;
  }

export default withList;
