function DragHandle({ listeners, attributes, activatorRef, size = 28 }) {
    const iconSize = size <= 22 ? 14 : 18;
    return (
        <button
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
                color: "#a1a1aa",
                padding: 0,
                flexShrink: 0,
                touchAction: "none",
            }}
        >
            <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor">
                <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
        </button>
    );
}

export default DragHandle;
