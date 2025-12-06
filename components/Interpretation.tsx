import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h3: ({node, ...props}) => <h3 className="text-lg text-gray-900 mt-10 mb-4 text-center tracking-widest uppercase" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 text-justify" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-gray-900 font-semibold" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 text-gray-500 ml-4 marker:text-gray-300" {...props} />,
                                table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="min-w-full text-left text-sm border-collapse" {...props} /></div>,
                                thead: ({node, ...props}) => <thead className="border-b border-gray-200 bg-gray-50/50" {...props} />,
                                tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-100" {...props} />,
                                tr: ({node, ...props}) => <tr className="transition-colors hover:bg-gray-50/30" {...props} />,
                                th: ({node, ...props}) => <th className="py-3 px-4 font-serif font-medium text-gray-600 tracking-wider uppercase text-xs" {...props} />,
                                td: ({node, ...props}) => <td className="py-3 px-4 text-gray-500 align-top" {...props} />,
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
