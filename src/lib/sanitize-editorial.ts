import sanitizeHtml from 'sanitize-html';
/** Editorial notes support prose, lists, tables and links, never active content. */
export function sanitizeEditorialHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p','br','h2','h3','h4','strong','b','em','i','ul','ol','li','a','blockquote','code','pre','table','thead','tbody','tr','th','td','caption','details','summary','sup','sub','span'],
    allowedAttributes: { a: ['href','title','target','rel'], th: ['scope','colspan','rowspan'], td: ['colspan','rowspan'] },
    allowedSchemes: ['http','https','mailto'],
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  });
}
