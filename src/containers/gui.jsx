import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {openExtensionLibrary} from '../reducers/modals.js';

import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';

import {setTab} from '../reducers/tabs.js';

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTabSelect'
        ]);
    }
    componentDidMount () {
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData);
        this.props.vm.setCompatibilityMode(true);
        this.props.vm.start();
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.props.vm.loadProject(nextProps.projectData);
        }
    }
    componentWillUnmount () {
        this.props.vm.stopAll();
    }
    handleTabSelect (tabIndex) {
        console.log(tabIndex)
        this.props.onSetTab(tabIndex);
    }
    render () {
        const {
            children,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            tab,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                enableExtensions={window.location.search.includes('extensions')}
                tabIndex={tab}
                vm={vm}
                onTabSelect={this.handleTabSelect}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    ...GUIComponent.propTypes,
    feedbackFormVisible: PropTypes.bool,
    previewInfoVisible: PropTypes.bool,
    projectData: PropTypes.string,
    vm: PropTypes.instanceOf(VM)
};

GUI.defaultProps = GUIComponent.defaultProps;

const mapStateToProps = state => ({
    feedbackFormVisible: state.modals.feedbackForm,
    previewInfoVisible: state.modals.previewInfo,
    tab: state.tabs.tab
});

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onSetTab: (tab) => dispatch(setTab(tab))
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

export default vmListenerHOC(ConnectedGUI);
