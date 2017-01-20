import React, { Children, Component, PropTypes } from 'react';
import {
  isServer,
} from './utils';

export default class DeepstreamRecord extends Component {
  constructor(props) {
    super(props);

    const cached = !isServer && window.__DS_RECORD_CACHE__ && window.__DS_RECORD_CACHE__[props.dsRecord];

    this.state = {
      isReady: cached,
      record: cached || {},
    }
  }

  componentWillMount() {
    isServer && this.createRecord();
  }

  componentDidMount() {
    //console.log(this._reactInternalInstance._debugID, 'DR did mount', this.props.dsRecord);
    this.createRecord();
  }

  componentWillUnmount() {
    //console.log(this._reactInternalInstance._debugID, 'DR will unmount', this.props.dsRecord);
    this.destroy();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dsRecord !== this.props.dsRecord) {
      //console.log(this._reactInternalInstance._debugID, 'dsRecord changed from', this.props.dsRecord, 'to', nextProps.dsRecord);
      this.setState({
        isReady: false,
        record: {},
      });

      setTimeout(() => {
        this.destroy();
        setTimeout(() => {
          this.createRecord();
        })
      })
    }
  }

  get ds() {
    return this.props.ds || this.context.ds;
  }

  createRecord = () => {
    const {
      dsRecord,
      } = this.props;

    this.record = this.ds.record.getRecord(dsRecord);

    this.justCreated = true;
    this.record.subscribe(this.handleServerChange, true);
    delete this.justCreated;
  }

  destroy = () => {
    if (!this.record) {
      return;
    }

    if (this.record.isDestroyed === false ) {
      //commented out due to a bug that only happens on server
      //when clicking on a product from homepage, the client sends an unsubscribe msg, but the ProductPage needs the same record
      //sometimes it works, sometimes it doesn't, my guess is that it works if the reply to the unsubscribe is quicker than the RPC answer (products/bySlug)
      //for now, at least, disable the unsubscription of records... let's see how far we get away with it :D
      //this.record.unsubscribe(this.handleServerChange);
      setTimeout(() => {
        //this.record.discard();
        delete this.record;
      })
    }
  }

  handleServerChange = () => {
    //console.log(this._reactInternalInstance._debugID, 'server changed', this.record.get())
    (this.justCreated || !isServer) && this.setState({
      isReady: true,
      record: this.record.get()
    });
  }

  handleClientChange = (property, value) => {
    const changesObject = typeof property === 'string' ? {[property]: value} : property;
    this.setState({
      record: {
        ...this.state.record,
        ...changesObject,
      }
    }, () => {
      this.record.set(this.state.record);
    })

    //console.log(this._reactInternalInstance._debugID, 'setting', property, value);
  }

  render() {
    const {
      isReady,
      record,
      } = this.state;
    const {
      dsRecord,
      children,
      ...otherProps
      } = this.props;

    if (!isReady) {
      return null;
    }

    //console.log(this._reactInternalInstance._debugID, 'DR rendering', dsRecord, record, this.record.isReady);


    //@TODO Check why children is array (even though only one child is passed) with the first element being null
    const onlyChild = Children.toArray(children).filter(child => child)[0];

    return React.cloneElement(Children.only(onlyChild), {
      dsRecord,
      record,
      onChange: this.handleClientChange,
      ...otherProps,
      ...onlyChild.props,
    });
  }
}

DeepstreamRecord.propTypes = {
  ds: PropTypes.object,
  dsRecord: PropTypes.string.isRequired,
}

DeepstreamRecord.contextTypes = {
  ds: PropTypes.object,
}
