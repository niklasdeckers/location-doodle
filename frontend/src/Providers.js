import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import PropTypes from 'prop-types';

const Providers = ({ store, children }) => (
  <ReduxProvider store={ store }>
    { children }
  </ReduxProvider>
);

Providers.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.object.isRequired,
};

export default Providers;