"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Heading1, Heading2, Heading3,
  Link as LinkIcon, Quote, Undo, Redo,
  Eraser
} from 'lucide-react';
import { useCallback } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children,
  title
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-sm transition-all flex items-center justify-center ${
      isActive 
        ? 'bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]' 
        : 'hover:bg-slate-200 text-slate-600'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent underline cursor-pointer',
        },
      }),
      CharacterCount,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate prose-lg md:prose-xl max-w-none focus:outline-none min-h-[600px] p-6 md:p-16 font-serif selection:bg-accent selection:text-white leading-relaxed text-slate-800 [overflow-wrap:anywhere] break-words',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full h-[600px] bg-slate-50 animate-pulse border-2 border-slate-900 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Iniciando Editor Editorial...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-2 border-slate-900 bg-white shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)] overflow-hidden">
      {/* ── Floating Toolbar ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-50 border-b-2 border-slate-900 z-40 transition-all duration-300">
        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <MenuButton 
            title="Desfazer"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo size={16} />
          </MenuButton>
          <MenuButton 
            title="Refazer"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <MenuButton 
            title="Título 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton 
            title="Título 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton 
            title="Título 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <MenuButton 
            title="Negrito"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold size={16} />
          </MenuButton>
          <MenuButton 
            title="Itálico"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic size={16} />
          </MenuButton>
          <MenuButton 
            title="Sublinhado"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          >
            <UnderlineIcon size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <MenuButton 
            title="Lista com Marcadores"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List size={16} />
          </MenuButton>
          <MenuButton 
            title="Lista Numerada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-1">
          <MenuButton 
            title="Link"
            onClick={setLink}
            isActive={editor.isActive('link')}
          >
            <LinkIcon size={16} />
          </MenuButton>
          <MenuButton 
            title="Citação"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2">
          <MenuButton 
            title="Limpar Formatação"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <Eraser size={16} />
          </MenuButton>
        </div>

        <div className="ml-auto px-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-l border-slate-200 hidden sm:block">
          Modo Editor Editorial v2.0
        </div>
      </div>

      {/* ── Area de Redação ────────────────────────────────────── */}
      <EditorContent 
        editor={editor} 
      />

      {/* ── Footer Info ────────────────────────────────────────── */}
      <div className="px-6 py-3 bg-slate-900 border-t-2 border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            {editor.storage.characterCount?.characters?.() || 0} Caracteres
          </span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
             {editor.storage.characterCount?.words?.() || 0} Palavras
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sincronização em Tempo Real</span>
        </div>
      </div>
    </div>
  );
}
