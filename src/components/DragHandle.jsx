import { MdOutlineDragIndicator } from "react-icons/md";

function DragHandle({ listeners, attributes, activatorRef, size = 28 }) {
    const iconSize = size <= 22 ? 14 : 18;
    return (
        <button
            className="drag-handle"
            ref={activatorRef}
            {...listeners}
            {...attributes}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: size,
                height: size,
                border: "none",
                background: "transparent",
                borderRadius: 6,
                cursor: "grab",
                color: "hsl(240, 8%, 50%)",
                padding: 0,
                flexShrink: 0,
                touchAction: "none",
            }}
        >
            <MdOutlineDragIndicator style={{ fontSize: iconSize }} />
        </button>
    );
}

export default DragHandle;
