import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

interface InterpretationProps {
    loading: boolean;
    content: string;
}

export const Interpretation: React.FC<InterpretationProps> = ({ loading, content }) => {
    return (
        <div className="ins-card p-10 md:p-16 rounded-3xl w-full min-h-[300px] border-none">
            <h2 className="text-xl font-serif text-center text-gray-800 mb-12 tracking-widest border-b border-gray-100 pb-6">
                灵感解析 · INTERPRETATION
            </h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <Loader2 className="animate-spin text-gray-300" size={32} />
                    <p className="font-serif text-sm text-gray-400 tracking-widest animate-pulse">
                        正在连接灵感场...
                    </p>
                </div>
            ) : (
                <div className="prose prose-stone max-w-none mx-auto prose-p:font-serif prose-headings:font-sans prose-headings:font-light prose-strong:font-medium">
                     <div className="text-gray-600 leading-loose space-y-6">
                        <ReactMarkdown
                            components={{
                                h3: ({node, ...props}) => <h3 className="text-lg text-gray-900 mt-10 mb-4 text-center tracking-widest uppercase" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 text-justify" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-gray-900 font-semibold" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 marker:text-gray-300" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                     </div>
                     
                     <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-300 font-serif italic">
                            此致 · The Universe
                        </p>
                     </div>
                </div>
            )}
        </div>
    );
};