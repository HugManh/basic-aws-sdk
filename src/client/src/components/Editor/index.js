import React, { useEffect, useRef, useState } from 'react'
import { basicSetup, EditorView } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { javascript } from '@codemirror/lang-javascript';
import * as api from '../../api';

let language = new Compartment, tabSize = new Compartment

export const Editor = ({ setEditorState }) => {
    const editor = useRef()
    const [code, setCode] = useState('')

    const onUpdate = EditorView.updateListener.of((v) => {
        setCode(v.state.doc.toString())
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getCode('js', "putObject");
                console.log('---------')
                console.log('---------',data)

                const state = EditorState.create({
                    doc: data || "Hello, world",  // hiển thị `data` nếu có, nếu không hiển thị mặc định
                    extensions: [
                        basicSetup,
                        xcodeDark,
                        language.of(javascript({ jsx: true })),
                        keymap.of(defaultKeymap),
                        tabSize.of(EditorState.tabSize.of(8)),
                        onUpdate,
                    ],
                });

                const view = new EditorView({ state, parent: editor.current });
                return () => view.destroy();
            } catch (error) {
                console.error("Failed to fetch code:", error);
            }
        };

        fetchData();
    }, [])

    return <div ref={editor}></div>
}
