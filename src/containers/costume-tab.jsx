import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import AssetPanel from '../components/asset-panel/asset-panel.jsx';
import PaintEditorWrapper from './paint-editor-wrapper.jsx';
import CostumeLibrary from './costume-library.jsx';
import BackdropLibrary from './backdrop-library.jsx';
import {connect} from 'react-redux';

import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    openCostumeLibrary,
    openBackdropLibrary
} from '../reducers/modals';

import addBlankCostumeIcon from '../components/asset-panel/icon--add-blank-costume.svg';
import addLibraryBackdropIcon from '../components/asset-panel/icon--add-backdrop-lib.svg';
import addLibraryCostumeIcon from '../components/asset-panel/icon--add-costume-lib.svg';
import fileUploadIcon from '../components/asset-button/icon--file-upload.svg';
import paintIcon from '../components/asset-button/icon--paint.svg';
import spriteIcon from '../components/asset-button/icon--sprite.svg';
import cameraIcon from '../components/asset-button/icon--camera.svg';
import surpriseIcon from '../components/asset-button/icon--surprise.svg';

import costumeLibraryContent from '../lib/libraries/costumes.json';

const messages = defineMessages({
    addLibraryCostumeMsg: {
        defaultMessage: 'Library',
        description: 'Button to add a costume in the editor tab',
        id: 'gui.costumeTab.addCostume'
    },
    addBlankCostumeMsg: {
        defaultMessage: 'Paint',
        description: 'Button to add a blank costume in the editor tab',
        id: 'gui.costumeTab.addBlankCostume'
    },
    addSurpriseCostumeMsg: {
        defaultMessage: 'Surpprise',
        description: 'Button to add a surprise costume in the editor tab',
        id: 'gui.costumeTab.addSurpriseCostume'
    },
    addFileCostumeMsg: {
        defaultMessage: 'Coming Soon',
        description: 'Button to add a file upload costume in the editor tab',
        id: 'gui.costumeTab.addFileCostume'
    },
    addCameraCostumeMsg: {
        defaultMessage: 'Coming Soon',
        description: 'Button to use the camera to create a costume costume in the editor tab',
        id: 'gui.costumeTab.addCameraCostume'
    }
});

class CostumeTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectCostume',
            'handleDeleteCostume',
            'handleNewCostume',
            'handleNewBlankCostume'
        ]);
        this.state = {selectedCostumeIndex: 0};
    }
    componentWillReceiveProps (nextProps) {
        const {
            editingTarget,
            sprites,
            stage
        } = nextProps;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (target && target.costumes && this.state.selectedCostumeIndex > target.costumes.length - 1) {
            this.setState({selectedCostumeIndex: target.costumes.length - 1});
        }
    }
    handleSelectCostume (costumeIndex) {
        this.props.vm.editingTarget.setCostume(costumeIndex);
        this.setState({selectedCostumeIndex: costumeIndex});
    }
    handleDeleteCostume (costumeIndex) {
        this.props.vm.deleteCostume(costumeIndex);
    }
    handleNewCostume () {
        if (!this.props.vm.editingTarget) return;
        const costumes = this.props.vm.editingTarget.sprite.costumes || [];
        this.setState({selectedCostumeIndex: Math.max(costumes.length - 1, 0)});
    }
    handleNewBlankCostume () {
        const emptyItem = costumeLibraryContent.find(item => (
            item.name === 'Empty'
        ));
        const name = this.props.vm.editingTarget.isStage ? `backdrop1` : `costume1`;
        const vmCostume = {
            name: name,
            rotationCenterX: emptyItem.info[0],
            rotationCenterY: emptyItem.info[1],
            bitmapResolution: emptyItem.info.length > 2 ? emptyItem.info[2] : 1,
            skinId: null
        };

        this.props.vm.addCostume(emptyItem.md5, vmCostume).then(() => {
            this.handleNewCostume();
        });
    }
    render () {
        // For paint wrapper
        const {
            intl,
            onNewLibraryBackdropClick,
            onNewLibraryCostumeClick,
            costumeLibraryVisible,
            backdropLibraryVisible,
            onRequestCloseCostumeLibrary,
            onRequestCloseBackdropLibrary,
            ...props
        } = this.props;

        const {
            editingTarget,
            sprites,
            stage,
            vm
        } = props;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;

        if (!target) {
            return null;
        }

        const addLibraryFunc = target.isStage ? onNewLibraryBackdropClick : onNewLibraryCostumeClick;
        const addLibraryIcon = target.isStage ? addLibraryBackdropIcon : addLibraryCostumeIcon;

        return (
            <AssetPanel
                buttons={[
                    {
                        message: intl.formatMessage(messages.addLibraryCostumeMsg),
                        img: addLibraryIcon,
                        onClick: addLibraryFunc
                    },
                    {
                        message: intl.formatMessage(messages.addCameraCostumeMsg),
                        img: cameraIcon
                    },
                    {
                        message: intl.formatMessage(messages.addFileCostumeMsg),
                        img: fileUploadIcon
                    },
                    {
                        message: intl.formatMessage(messages.addSurpriseCostumeMsg),
                        img: surpriseIcon
                    },
                    {
                        message: intl.formatMessage(messages.addBlankCostumeMsg),
                        img: paintIcon,
                        onClick: this.handleNewBlankCostume
                    }
                ]}
                items={target.costumes || []}
                selectedItemIndex={this.state.selectedCostumeIndex}
                onDeleteClick={target.costumes.length > 1 ? this.handleDeleteCostume : null}
                onItemClick={this.handleSelectCostume}
            >
                {target.costumes ?
                    <PaintEditorWrapper
                        {...props}
                        selectedCostumeIndex={this.state.selectedCostumeIndex}
                    /> :
                    null
                }
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onNewCostume={this.handleNewCostume}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onNewBackdrop={this.handleNewCostume}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
            </AssetPanel>
        );
    }
}

CostumeTab.propTypes = {
    backdropLibraryVisible: PropTypes.bool,
    costumeLibraryVisible: PropTypes.bool,
    editingTarget: PropTypes.string,
    intl: intlShape,
    onNewLibraryBackdropClick: PropTypes.func.isRequired,
    onNewLibraryCostumeClick: PropTypes.func.isRequired,
    onRequestCloseBackdropLibrary: PropTypes.func.isRequired,
    onRequestCloseCostumeLibrary: PropTypes.func.isRequired,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costumes: PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired
            }))
        })
    }),
    stage: PropTypes.shape({
        sounds: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        }))
    }),
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    editingTarget: state.targets.editingTarget,
    sprites: state.targets.sprites,
    stage: state.targets.stage,
    costumeLibraryVisible: state.modals.costumeLibrary,
    backdropLibraryVisible: state.modals.backdropLibrary
});

const mapDispatchToProps = dispatch => ({
    onNewLibraryBackdropClick: e => {
        e.preventDefault();
        dispatch(openBackdropLibrary());
    },
    onNewLibraryCostumeClick: e => {
        e.preventDefault();
        dispatch(openCostumeLibrary());
    },
    onRequestCloseBackdropLibrary: () => {
        dispatch(closeBackdropLibrary());
    },
    onRequestCloseCostumeLibrary: () => {
        dispatch(closeCostumeLibrary());
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CostumeTab));
