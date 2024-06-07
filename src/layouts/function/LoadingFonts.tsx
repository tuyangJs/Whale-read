function addFont(fontName: string, fontUrl: string): void {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(`
        @font-face {
            font-family: '${fontName}';
            src: url('${fontUrl}') format('woff');
        }
    `));
    document.head.appendChild(style);
}
