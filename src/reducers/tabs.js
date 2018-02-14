const SET_TAB = 'scratch-gui/toolbox/SET_TAB';

const initialState = {
    tab: 0
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_TAB:
        return Object.assign({}, state, {
            tab: action.tab
        });
    default:
        return state;
    }
};

const setBlocksTab = function () {
    return {
        type: SET_TAB,
        tab: 0
    };
};

const setCostumesTab = function () {
    return {
        type: SET_TAB,
        tab: 1
    };
};

const setSoundsTab = function () {
    return {
        type: SET_TAB,
        tab: 2
    };
};

const setTab = function (tab) {
    return {
        type: SET_TAB,
        tab: tab
    };
};


export {
    reducer as default,
    setBlocksTab,
    setCostumesTab,
    setSoundsTab,
    setTab
};
