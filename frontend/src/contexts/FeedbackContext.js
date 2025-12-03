import React, { createContext, useContext, useState, useCallback } from 'react';
import FeedbackModal from '../components/FeedbackModal';

const FeedbackContext = createContext();

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};

export const FeedbackProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const [resolveConfirm, setResolveConfirm] = useState(null);

    const closeModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (resolveConfirm) {
            resolveConfirm(false);
            setResolveConfirm(null);
        }
    }, [resolveConfirm]);

    const showModal = useCallback((type, title, message, onConfirm = () => { }) => {
        setModalState({
            isOpen: true,
            type,
            title,
            message,
            onConfirm,
        });
    }, []);

    const showSuccess = useCallback((title, message) => {
        showModal('success', title, message);
    }, [showModal]);

    const showError = useCallback((title, message) => {
        showModal('error', title, message);
    }, [showModal]);

    const showInfo = useCallback((title, message) => {
        showModal('info', title, message);
    }, [showModal]);

    const showConfirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            setResolveConfirm(() => resolve);
            showModal('confirm', title, message, () => resolve(true));
        });
    }, [showModal]);

    return (
        <FeedbackContext.Provider value={{ showSuccess, showError, showInfo, showConfirm }}>
            {children}
            <FeedbackModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
            />
        </FeedbackContext.Provider>
    );
};
