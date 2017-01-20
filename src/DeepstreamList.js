import React, { Children, Component, PropTypes } from 'react';
import {
  isServer,
} from './utils';

export default class DeepstreamList extends Component {
  constructor(props) {
    super(props);

    const cached = !isServer && window.__DS_CACHE__ && window.__DS_CACHE__[props.dsRecord];

    this.state = {
      entries: cached || [],
    }
  }

  componentWillMount() {
    isServer && this.subscribe();
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dsList !== this.props.dsList) {
      setTimeout(() => {
        this.unsubscribe();
        this.subscribe();
      })
    }
  }

  get ds() {
    return this.props.ds || this.context.ds;
  }

  subscribe() {
    const {
      dsList,
      } = this.props;

    this.list = this.ds.record.getList( dsList );

    /*
    this.list.whenReady(list => {
      const entries = list.getEntries();

      this.handleListEntries(entries)
    });
    */

    this.justCreated = true;
    this.list.subscribe(this.handleListEntries, true);
    delete this.justCreated;
  }

  unsubscribe() {
    //this.list.unsubscribe(this.handleListEntries);
    //this.list.discard();
    delete this.list;
  }

  handleListEntries = (entries) => {
   (this.justCreated || !isServer) &&  this.setState({ entries });
  }

  handleAddEntry = (entryId, idx) => {
    const {
      dsList,
      } = this.props;

    entryId = entryId || `${dsList}/${this.ds.getUid()}`

    this.list.addEntry(entryId, idx);
  }

  render() {
    const {
      children,
      } = this.props;

    const {
      entries,
      } = this.state;

    const props = {
      addEntry: this.handleAddEntry,
      entries,
    };

    return React.cloneElement(Children.only(children), props);
  }
}

DeepstreamList.propTypes = {
  ds: PropTypes.object,
  dsList: PropTypes.string.isRequired,
}

DeepstreamList.contextTypes = {
  ds: PropTypes.object,
}

DeepstreamList.defaultProps = {
}
