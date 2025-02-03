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
                const response = await fetch('http://localhost:8000/code/js/show?filename=putObject', {
                    method: 'GET',
                    headers: {
                        Accept: 'text/event-stream',
                    },
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                const initialState = EditorState.create({
                    doc: "",  // hiển thị `data` nếu có, nếu không hiển thị mặc định
                    extensions: [
                        basicSetup,
                        xcodeDark,
                        language.of(javascript({ jsx: true })),
                        keymap.of(defaultKeymap),
                        tabSize.of(EditorState.tabSize.of(8)),
                        onUpdate,
                    ],
                });

                const view = new EditorView({
                    state: initialState,
                    parent: editor.current
                });

                // Stream data and update editor document
                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value);
                    view.dispatch({
                        changes: {from: view.state.doc.length, insert: text},
                    });
                }

                return () => view.destroy();
            } catch (error) {
                console.error("Failed to fetch code:", error);
            }
        };

        fetchData();
    }, [])

    return <div ref={editor}></div>
}
