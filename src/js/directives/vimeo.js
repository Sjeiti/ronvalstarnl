export const vimeo = (elm, content)=>{
  const id = elm.dataset.vimeo
  elm.style = 'padding:56.25% 0 0 0;position:relative;'
  elm.innerHTML = `<iframe
      src="https://player.vimeo.com/video/${id}" 
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;" 
      title="${content}"
      mozallowfullscreen
    ></iframe>`
}
