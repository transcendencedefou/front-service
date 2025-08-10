import { Control, StackPanel, Rectangle, TextBlock } from '@babylonjs/gui';

export function CreateControlsOverlay(): Rectangle {
    const overlay = new Rectangle("ControlsOverlay");
    overlay.width = "18%";
    overlay.thickness = 1;
    overlay.cornerRadius = 16;
    overlay.color = "#00D4FF";
    overlay.background = "#000000";
    overlay.alpha = 0.97;
    overlay.paddingRight = "2%";
    overlay.paddingTop = "8%";
    overlay.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    overlay.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    overlay.clipChildren = false;
    overlay.zIndex = 20;
    overlay.adaptHeightToChildren = true;

    const content = new StackPanel("ControlsOverlayContent");
    content.width = "100%";
    content.isVertical = true;
    content.paddingLeft = "18px";
    content.paddingRight = "18px";
    content.paddingTop = "18px";
    content.paddingBottom = "18px";
    content.spacing = 8;
    content.zIndex = 1;
    content.adaptHeightToChildren = true;

    const title = new TextBlock("ControlsTitle", "Contrôles");
    title.fontFamily = "'Inclusive Sans', sans-serif";
    title.height = "34px";
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
    title.fontSize = "26px";
    title.fontWeight = "700";
    title.color = "#00D4FF";
    title.outlineWidth = 4;
    title.outlineColor = "#000000";
    content.spacing = 16;
    content.addControl(title);

    const addKeyRow = (label: string, desc: string) => {
        const row = new StackPanel();
        row.isVertical = false;
        row.height = "32px";
        row.width = "100%";
        row.spacing = 10;
        row.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        const key = new Rectangle();
        key.width = "64px";
        key.height = "100%";
        key.thickness = 1;
        key.cornerRadius = 8;
        key.color = "#FFFFFF";
        key.background = "#111111";
        key.alpha = 0.9;
        key.clipChildren = false;

        const keyText = new TextBlock(undefined, label);
        keyText.fontFamily = "'Inclusive Sans', sans-serif";
        keyText.fontSize = "18px";
        keyText.fontWeight = "700";
        keyText.color = "#FFFFFF";
        keyText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        keyText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        key.addControl(keyText);

        const descText = new TextBlock(undefined, desc);
        descText.fontFamily = "'Inclusive Sans', sans-serif";
        descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        descText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        descText.fontSize = "18px";
        descText.color = "#EDEDED";

        row.addControl(key);
        row.addControl(descText);
        content.addControl(row);
    };

    addKeyRow("W  \\  S", "Player 1");
    addKeyRow("↑  \\  ↓", "Player 2");
    addKeyRow("Space",   "Start / Stop");
    addKeyRow("Soon",    "Menu / Quitter");
    addKeyRow("R",       "Reset / Restart");

    overlay.addControl(content);

    return overlay;
}