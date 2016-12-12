import React, {
  PropTypes,
} from 'react';
import DeepstreamRecord from './DeepstreamRecord';

const withRecord =
  (WrappedComponent, dsRecord) => {
    const Component = (props, context) => {
      const ds = props.ds || context.ds;

      return (
        <DeepstreamRecord ds={ ds } dsRecord={ props.dsRecord || dsRecord }>
          <WrappedComponent { ...props } />
        </DeepstreamRecord>
      )
    }

    Component.contextTypes = {
      ds: PropTypes.object,
    }

    return Component;
  }

export default withRecord;
