import React, { useEffect, useRef, useState } from 'react'
import { basicSetup, EditorView } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { javascript } from '@codemirror/lang-javascript';

let language = new Compartment, tabSize = new Compartment

export const Editor = ({ setEditorState }) => {
    const editor = useRef()
    const [code, setCode] = useState('')

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString())
    })

    useEffect(() => {
        const state = EditorState.create({
            doc: 'Hello World',
            extensions: [
                basicSetup,
                xcodeDark,
                language.of(javascript({ jsx: true })),
                keymap.of(defaultKeymap),
                tabSize.of(EditorState.tabSize.of(8)),
                onUpdate,
            ],
        })

        const view = new EditorView({ state, parent: editor.current })

        return () => {
            view.destroy()
        }
    }, [])

    return <div ref={editor}></div>
}
