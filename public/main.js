import {file2DataURI} from './util.js'


window.addEventListener('DOMContentLoaded', ()=>{
    console.log('DOMContentLoaded')
    document.querySelector('input[type="file"]').addEventListener('change', (event)=> displayImage(event))
})


async function displayImage(event){
    console.log('ADD FILE')
    const files = event.target.files
    const file = files[0]
    if(file){
        const data = await file2DataURI(file)
        const img = document.querySelector('image')
        img.src = data
    }
}