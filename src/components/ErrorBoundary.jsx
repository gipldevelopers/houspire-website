import { Component } from 'react';
import { captureComponentError } from '@/lib/errorTracking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleRetry = () => {
            this.setState({ hasError: false, error: null, errorInfo: null });
        };
        this.handleGoHome = () => {
            window.location.href = '/';
        };
        this.handleContact = () => {
            window.location.href = 'mailto:support@houspire.ai';
        };
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        captureComponentError(error, { componentStack: errorInfo.componentStack || '' });
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (<div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-destructive"/>
              </div>
            </div>
            
            <h2 className="text-2xl font-heading font-bold mb-3">
              Something went wrong
            </h2>
            
            <p className="text-muted-foreground mb-6">
              We're sorry for the inconvenience. Our team has been notified and will fix this issue as soon as possible.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (<div className="bg-muted p-4 rounded-lg mb-6 text-left">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Error Details (Development Only)
                </p>
                <div className="overflow-auto max-h-32">
                  <code className="text-xs text-destructive block">
                    Error: {this.state.error.message}
                  </code>
                  {this.state.error.stack && (<pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>)}
                </div>
              </div>)}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                <Home className="h-4 w-4 mr-2"/>
                Go Home
              </Button>
              <Button onClick={this.handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2"/>
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleContact} className="flex-1">
                <Mail className="h-4 w-4 mr-2"/>
                Contact Support
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              If this problem persists, please contact{' '}
              <a href="mailto:support@houspire.ai" className="text-primary underline hover:no-underline">
                support@houspire.ai
              </a>
            </p>
          </Card>
        </div>);
        }
        return this.props.children;
    }
}
