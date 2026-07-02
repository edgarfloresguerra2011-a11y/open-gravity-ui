'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary global.
 *
 * Captura errores en el árbol de React y muestra un fallback en lugar
 * de un crash blanco. En producción, evita que un bug en un componente
 * (chat, prediction report, etc.) rompa toda la página.
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // En producción esto debería reportarse a Sentry/Datadog
        console.error('[ErrorBoundary]', error, errorInfo.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div
                    role="alert"
                    className="p-8 m-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-200"
                >
                    <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
                    <p className="text-sm mb-4">
                        {this.state.error?.message ?? 'Error desconocido en el componente.'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-100 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
