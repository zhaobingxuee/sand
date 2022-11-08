export default function debounce(fn:Function,...args:[string,string]){
  let timer: NodeJS.Timer | null = null
  return function(){
    clearTimeout(Number(timer))
    timer = setTimeout(()=>{
      fn(args[0],args[1])
    },500)
  }
}