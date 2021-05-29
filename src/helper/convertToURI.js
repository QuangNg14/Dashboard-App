import base64 from 'base64-js'
import * as FileSystem from "expo-file-system"


function stringToUint8Array(str) {
    const length = str.length
    const array = new Uint8Array(new ArrayBuffer(length))
    for(let i = 0; i < length; i++) array[i] = str.charCodeAt(i)
    return array
}

export async function fileToBase64(uri) {
    try {
        const content = await FileSystem.readAsStringAsync(uri)
        return base64.fromByteArray(stringToUint8Array(content))
    } catch(e) {
        console.warn('fileToBase64()', e.message)
        return ''
    }
}

/* Accepts 'rawFile' file object or the data 'uri' */
export function fileToBase64Helper(rawFile, uri) {
    return fileToBase64(rawFile ? rawFile : uri)
}