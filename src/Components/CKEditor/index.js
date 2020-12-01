import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ckeditor, { CKEditor } from "@ckeditor/ckeditor5-react";
import InputLabel from "@material-ui/core/InputLabel";

function CKEditorComponent(props) {
  return (
    <div>
      <InputLabel
        style={{
          margin: "10px 0px 5px 40px",
          fontSize: 14,
        }}
      >
        {props.label}
      </InputLabel>

      <div style={{ paddingLeft: "40px" }}>
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {
            editor &&
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "height",
                  "150px",
                  editor.editing.view.document.getRoot()
                );
              });
          }}
          config={{
            removePlugins: [
              "Image",
              "ImageCaption",
              "ImageStyle",
              "ImageToolbar",
              "ImageUpload",
              "MediaEmbed",
            ],
          }}
          data={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}

export default CKEditorComponent;
