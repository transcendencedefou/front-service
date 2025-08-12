import { Control, StackPanel, Grid, Rectangle, TextBlock } from '@babylonjs/gui';
import { useColorStore } from '@/stores/colorStore';
import { watch } from 'vue';

export function CreateControlsOverlay(t: (k: string) => string): Rectangle {
    const colorStore = useColorStore();

    const overlay = new Rectangle("ControlsOverlay");
    overlay.width = "18%";
    overlay.thickness = 1;
    overlay.cornerRadius = 16;
    overlay.color = colorStore.controlsOverlayBorder;
    watch(() => colorStore.controlsOverlayBorder, (v) => (overlay.color = v));
    overlay.background = colorStore.controlsOverlayBackground;
    watch(() => colorStore.controlsOverlayBackground, (v) => (overlay.background = v));
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

    const title = new TextBlock("ControlsTitle", t('pong.controls.title'));
    title.fontFamily = "'Inclusive Sans', sans-serif";
    title.height = "34px";
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
    title.fontSize = "26px";
    title.fontWeight = "700";
    title.color = colorStore.controlsTitleText;
    watch(() => colorStore.controlsTitleText, (v) => (title.color = v));
    title.outlineWidth = 4;
    title.outlineColor = colorStore.controlsTitleOutline;
    watch(() => colorStore.controlsTitleOutline, (v) => (title.outlineColor = v));
    content.spacing = 16;
    content.addControl(title);

    const addKeyRow = (label: string, desc: string) => {
        const row = new Grid();
        row.addColumnDefinition(64, true);
        row.addColumnDefinition(1);
        row.addRowDefinition(32, true);
        row.height = "32px";
        row.width = "100%";
        row.columnSpacing = 10;
        row.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        const key = new Rectangle();
        key.width = "64px";
        key.height = "100%";
        key.thickness = 1;
        key.cornerRadius = 8;
        key.color = colorStore.controlsKeyBorder;
        watch(() => colorStore.controlsKeyBorder, (v) => (key.color = v));
        key.background = colorStore.controlsKeyBackground;
        watch(() => colorStore.controlsKeyBackground, (v) => (key.background = v));
        key.alpha = 0.9;
        key.clipChildren = false;

        const keyText = new TextBlock(undefined, label);
        keyText.fontFamily = "'Inclusive Sans', sans-serif";
        keyText.fontSize = "18px";
        keyText.fontWeight = "700";
        keyText.color = colorStore.controlsKeyText;
        watch(() => colorStore.controlsKeyText, (v) => (keyText.color = v));
        keyText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        keyText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        key.addControl(keyText);

        const descText = new TextBlock(undefined, desc);
        descText.fontFamily = "'Inclusive Sans', sans-serif";
        descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        descText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        descText.fontSize = "18px";
        descText.color = colorStore.controlsDescText;
        watch(() => colorStore.controlsDescText, (v) => (descText.color = v));

        row.addControl(key, 0, 0);
        row.addControl(descText, 0, 1);
        content.addControl(row);
    };

    addKeyRow(t('pong.keys.w_s'), t('pong.controls.player1'));
    addKeyRow(t('pong.keys.up_down'), t('pong.controls.player2'));
    addKeyRow(t('pong.keys.space'), t('pong.actions.start_stop'));
    addKeyRow(t('pong.keys.r'), t('pong.actions.reset_restart'));

    overlay.addControl(content);
    return overlay;
}