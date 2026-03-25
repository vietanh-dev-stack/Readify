import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'

import {
  Box, IconButton, Tooltip, Divider
} from '@mui/material'

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  Code,
  FormatQuote,
  Image as ImageIcon,
  Title
} from '@mui/icons-material'

const TiptapEditor = ({ content, onChange }) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  if (!editor) return null

  const addImage = () => {
    const url = prompt('Nhập URL ảnh')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const isActive = (type, options = {}) => {
    return editor.isActive(type, options)
  }

  const buttonStyle = (active) => ({
    background: active ? '#1976d2' : '#f5f5f5',
    color: active ? '#fff' : '#333'
  })

  return (
    <Box>

      {/* Toolbar */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2,
        p: 1,
        border: '1px solid #ddd',
        borderRadius: 2,
        background: '#fafafa'
      }}>

        <Tooltip title="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            sx={buttonStyle(isActive('bold'))}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            sx={buttonStyle(isActive('italic'))}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            sx={buttonStyle(isActive('underline'))}
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Heading">
          <IconButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            sx={buttonStyle(isActive('heading', { level: 2 }))}
          >
            <Title />
          </IconButton>
        </Tooltip>

        <Tooltip title="List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            sx={buttonStyle(isActive('bulletList'))}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Quote">
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            sx={buttonStyle(isActive('blockquote'))}
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Block">
          <IconButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            sx={buttonStyle(isActive('codeBlock'))}
          >
            <Code />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Thêm ảnh">
          <IconButton onClick={addImage}>
            <ImageIcon />
          </IconButton>
        </Tooltip>

      </Box>

      {/* Editor */}
      <Box sx={{
        border: '1px solid #ddd',
        borderRadius: 3,
        p: 2,
        minHeight: 250,
        '& .ProseMirror': {
          outline: 'none'
        }
      }}>
        <EditorContent editor={editor} />
      </Box>

    </Box>
  )
}

export default TiptapEditor