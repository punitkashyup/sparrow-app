import type { Compartment } from "@codemirror/state";
import type { EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { RequestDataType } from "$lib/utils/enums";
import { html } from "@codemirror/lang-html";
import { jsonSetup } from "./codeMirrorTheme";
import { xml } from "@codemirror/lang-xml";

const CodeMirrorViewHandler = (
  codeMirrorView: EditorView,
  languageConf: Compartment,
  tab: RequestDataType,
) => {
  switch (tab) {
    case RequestDataType.HTML:
      codeMirrorView.dispatch({
        effects: languageConf.reconfigure(
          html({
            matchClosingTags: true,
            selfClosingTags: true,
            autoCloseTags: true,
          }),
        ),
      });
      break;
    case RequestDataType.JAVASCRIPT:
      codeMirrorView.dispatch({
        effects: languageConf.reconfigure(
          javascript({ jsx: true, typescript: true }),
        ),
      });
      break;
    case RequestDataType.JSON:
      codeMirrorView.dispatch({
        effects: languageConf.reconfigure(jsonSetup),
      });
      break;
    case RequestDataType.XML:
      codeMirrorView.dispatch({
        effects: languageConf.reconfigure(xml()),
      });
      break;
    default:
      codeMirrorView.dispatch({
        effects: languageConf.reconfigure([]),
      });
      break;
  }
};

export default CodeMirrorViewHandler;
