import fileData from "../static/moduleFile.json"

export const downModuleTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([fileData.file], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Module File Txt.txt";
    document.body.appendChild(element); // required for this to work in FireFox
    element.click();
}
