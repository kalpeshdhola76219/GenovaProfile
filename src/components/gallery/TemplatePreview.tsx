import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TemplateMetadata, DocumentData } from '../../types/document';
import { getPreviewDataForTemplate } from '../../data/previewSampleData';
import { sanitizeDocumentTextFields } from '../../utils/textSanitizer';

interface TemplatePreviewProps {
  template: TemplateMetadata;
  data?: DocumentData;
  className?: string;
}

class TemplateErrorBoundary extends React.Component<
  { children: React.ReactNode; templateName: string; color: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('Template preview error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
          <div
            className="w-12 h-12 rounded-xl mb-2 flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: this.props.color }}
          >
            {this.props.templateName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-slate-700">{this.props.templateName}</span>
          <span className="text-[10px] text-slate-400">Preview rendering fallback</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  data,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isNearScreen, setIsNearScreen] = useState<boolean>(false);

  // Lazy render thumbnail only when near screen (IntersectionObserver, 200px margin)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsNearScreen(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Measure container width via ResizeObserver
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    };

    updateWidth();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width || (containerRef.current?.clientWidth ?? 0);
          if (width > 0) {
            setContainerWidth(width);
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Preview data memoized
  const previewData = useMemo(() => {
    const hasValidData = Boolean(
      data &&
      (Boolean(data.personal?.fullName?.trim()) ||
        Boolean(data.experience && data.experience.length > 0) ||
        Boolean(data.education && data.education.length > 0) ||
        Boolean(data.coverLetter?.hiringManagerName?.trim() || data.coverLetter?.companyName?.trim()))
    );

    return hasValidData && data ? data : getPreviewDataForTemplate(template.id, template.type);
  }, [data, template.id, template.type]);

  const TemplateComponent = template.component;
  const currentWidth = containerWidth || containerRef.current?.clientWidth || 300;
  const standardScale = currentWidth / 794;

  return (
    <div
      ref={containerRef}
      style={{
        aspectRatio: '210 / 297',
      }}
      className={`relative w-full aspect-[210/297] bg-white overflow-hidden select-none pointer-events-none rounded-t-xl ${className}`}
    >
      {!isNearScreen ? (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-200/80" />
        </div>
      ) : (
        <TemplateErrorBoundary templateName={template.name} color={template.primaryColorSample}>
          <div
            style={{
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${standardScale})`,
              transformOrigin: 'top left',
              backgroundColor: '#ffffff',
            }}
            className="origin-top-left transition-transform duration-75"
          >
            <TemplateComponent data={sanitizeDocumentTextFields(previewData)} />
          </div>
        </TemplateErrorBoundary>
      )}
    </div>
  );
};
