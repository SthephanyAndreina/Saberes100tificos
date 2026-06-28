"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { createClient } from "@/lib/supabase/client";
import { admin } from "./ui";
import { fonts } from "@/lib/theme";

export default function TiptapEditor({ value = "", onChange, placeholder = "Escribe tu artículo aquí…" }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // evita desajustes de hidratación en Next.js
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      LinkExt.configure({ openOnClick: false, autolink: true }),
      ImageExt.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "tiptap prose", style: "min-height: 320px; padding: 18px;" },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  if (!editor) {
    return <div style={{ border: `1.5px solid ${admin.border}`, borderRadius: 12, minHeight: 360 }} />;
  }

  function setLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `inline/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("covers").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("covers").getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch (ex) {
      window.alert("No se pudo subir la imagen: " + (ex?.message || ""));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const Btn = ({ onClick, active, children, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        minWidth: 34,
        height: 32,
        padding: "0 9px",
        borderRadius: 8,
        border: `1px solid ${active ? admin.primary : admin.border}`,
        background: active ? `${admin.primary}15` : "#fff",
        color: active ? admin.primary : admin.text,
        fontSize: 13.5,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: fonts.sans,
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ border: `1.5px solid ${admin.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 10, borderBottom: `1px solid ${admin.border}`, background: "#fafbfc" }}>
        <Btn title="Negrita" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><b>B</b></Btn>
        <Btn title="Cursiva" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></Btn>
        <Btn title="Subrayado" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><u>U</u></Btn>
        <Sep />
        <Btn title="Título" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn title="Subtítulo" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>
        <Sep />
        <Btn title="Lista con viñetas" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• Lista</Btn>
        <Btn title="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. Lista</Btn>
        <Btn title="Cita" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>❝</Btn>
        <Sep />
        <Btn title="Alinear izquierda" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>⯇</Btn>
        <Btn title="Centrar" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>≡</Btn>
        <Btn title="Alinear derecha" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>⯈</Btn>
        <Sep />
        <Btn title="Enlace" onClick={setLink} active={editor.isActive("link")}>🔗</Btn>
        <Btn title="Imagen" onClick={() => fileRef.current?.click()}>{uploading ? "…" : "🖼️"}</Btn>
        <Sep />
        <Btn title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>↶</Btn>
        <Btn title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>↷</Btn>
      </div>
      <EditorContent editor={editor} />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
    </div>
  );
}

function Sep() {
  return <span style={{ width: 1, background: admin.border, margin: "2px 2px" }} />;
}
