/* Tratamiento editorial del texto y navegación entre citas y bibliografía. */
'use strict';
const keyIdeas = [
'señales automáticas de riesgo','dialectos de resistencia','hablar para dos lectores al mismo tiempo','conservar su sentido para la comunidad','la necesidad de ser encontrado','adaptaban sus mensajes anticipando posibles restricciones','no comprueba que cada modificación evite una sanción','Cambiar letras no garantiza que el significado deje de ser reconocido','tanto en la forma de las palabras como en sus significados','búsqueda por bola de nieve',
'esa clasificación tiene consecuencias','siguen siendo decisiones de personas y organizaciones','sus reglas influyen en las palabras elegidas','antes de recibir una sanción','hablar y reconocer a quienes comparten una situación','La adaptación necesita renovarse','mantener la comprensión, la confianza y la memoria','entender y discutir las reglas',
'antes de que el mensaje sea visible','qué comparte, con quién y en qué momento','El silencio necesita interpretarse dentro de su contexto','tiempo, vínculos y recursos','una barrera de entrada','transmitir las experiencias y restricciones','demasiado ambigua','La ambigüedad tiene usos distintos','enseñar sin exponer innecesariamente','no demuestra que eliminar un nombre borre una idea','más difíciles de nombrar, reconocer y transmitir públicamente',
'Establecen normas, prioridades y consecuencias','no equivalen necesariamente a comprender la intención','no son iguales para todos','acceso al significado, además de acceso al mensaje','texto, voz, videos, subtítulos e imágenes','hacer ilegible un mensaje y ocultar su existencia','El soporte condiciona lo que se conserva','experiencia → expresión adaptada → lectura del sistema → interpretación del destinatario',
'quién establece las categorías de riesgo','sin restringir injustamente conversaciones legítimas','se construye pertenencia','si la persona todavía se reconoce','ser comprendido dentro de la conversación pública','expresar algo indirectamente','dimensiones social, comunitaria y humana',
'sin convertir todos los contextos en una misma situación','sustitución verbal y visual','humor y pertenencia','rutinas profesionales','contexto compartido','otro sentido para quien conoce la regla','cosas diferentes a lectores distintos','establecer contacto y enseñar el código','La confianza personal sostenía la red','un espacio y recursos para hacerla circular','palabras, conocimientos compartidos, medios disponibles y personas que enseñen y transmitan',
'localizarla y entenderla puede resultar imposible','disponer de un texto no garantiza comprenderlo','lo descartado por unos puede ser lo que otros necesitan','sentidos diferentes según la lengua','no comparten necesariamente la misma lectura','una guía para describir la realidad','Asignar una etiqueta no resuelve el significado','expresar y recordar otras versiones','conservar la historia de las reglas','una comunidad que transmite','una voz propia'
];
const leadLabels = [
'Escala','Dependencia de la visibilidad','Incertidumbre','Necesidad de comunicarse y pertenecer','Circulación y aprendizaje',
'Quienes definen lo aceptable','Quienes preparan y aplican la clasificación','Quienes son observados','Quienes sostienen la comunicación',
'Política','Ética','Social y comunitaria','Humana e individual','Cívica y de participación','Poética',
'Algospeak','Leetspeak y argot hacker','Periodismo adaptado','Lenguaje esópico','Cockney rhyming slang','Cartas del sistema HK','Tap code','Samizdat','Zines',
'Tlön, Uqbar, Orbis Tertius','El idioma analítico de John Wilkins','1984','Rebelión en la granja','Fahrenheit 451','The Unnamable'
];
const referenceRecords = [];
let referenceRecord;
chapters[7].blocks.forEach(block => {
  if (block.type === 'h3') {
    referenceRecord = null;
    if (block.text !== 'Referencias académicas y bibliográficas') referenceRecords.push({heading:block.text});
    return;
  }
  const match = block.text.match(/^\[(\d+)\]\s*(.*)/);
  if (match) { referenceRecord={number:Number(match[1]),text:match[2]}; referenceRecords.push(referenceRecord); }
  else if(referenceRecord) referenceRecord.text += ' '+block.text;
});
const escapePattern = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const emphasisPattern = new RegExp('('+keyIdeas.slice().sort((a,b)=>b.length-a.length).map(escapePattern).join('|')+')','gi');
function appendEmphasis(element, text) {
  text.split(emphasisPattern).forEach((part,index) => {
    if(index%2){const strong=document.createElement('strong');strong.textContent=part;element.append(strong);}
    else element.append(document.createTextNode(part));
  });
}
function citationNumbers(text) {
  const numbers = new Set();
  // Los detalles de página después de una coma pertenecen a la fuente anterior.
  text.split(';').forEach(part => {
    const match=part.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?/);
    if(!match)return;
    const from=Number(match[1]),to=match[2]?Number(match[2]):from;
    for(let n=from;n<=to;n++)if(n>=1&&n<=29)numbers.add(n);
  });
  return [...numbers];
}
function appendEditorialText(element,text) {
  text.split(/(https?:\/\/[^\s]+|\[\d+[^\]]*\])/g).forEach(part => {
    if(/^https?:\/\//.test(part)){
      const link=document.createElement('a');link.href=part;link.textContent=part;link.target='_blank';link.rel='noopener noreferrer';element.append(link);
    } else if(/^\[\d/.test(part)){
      const group=document.createElement('span');group.className='citation-group';
      const ids=citationNumbers(part.slice(1,-1));
      ids.forEach(n=>{
        const link=document.createElement('a');link.className='citation-link';link.href=`#referencias/ref-${n}`;link.textContent=String(n);
        link.setAttribute('aria-label',`Consultar referencia ${n}`);link.title=`Referencia ${n} · ${part}`;
        link.addEventListener('click',event=>{event.preventDefault();goToReference(n);});group.append(link);
      });
      const detail=part.slice(1,-1).match(/,\s*(.*)/);
      if(detail){const note=document.createElement('span');note.className='citation-detail';note.textContent=detail[1];group.append(note);}
      element.append(group);
    } else appendEmphasis(element,part);
  });
}
function renderBibliography(container) {
  if(referenceReturn){
    const back=document.createElement('button');back.className='reference-return';back.textContent=`← Volver a «${chapters[referenceReturn.index].name}»`;
    back.addEventListener('click',()=>{
      const saved=referenceReturn;openChapter(saved.index);$('#dialog-article').scrollTop=saved.scroll;
      const citation=[...document.querySelectorAll('.citation-link')].find(link=>link.getAttribute('href')===`#referencias/ref-${saved.number}`);
      citation?.focus({preventScroll:true});referenceReturn=null;
    });container.append(back);
  }
  referenceRecords.forEach(record=>{
    if(record.heading){const heading=document.createElement('h3');heading.textContent=record.heading;container.append(heading);return;}
    const entry=document.createElement('section');entry.className='bibliography-entry';entry.id=`ref-${record.number}`;entry.tabIndex=-1;entry.setAttribute('aria-label',`Referencia ${record.number}`);
    const marker=document.createElement('span');marker.className='reference-number';marker.textContent=String(record.number).padStart(2,'0');
    const text=document.createElement('p');
    const urls=record.text.match(/https?:\/\/[^\s]+/g)||[];
    const body=record.text.replace(/https?:\/\/[^\s]+/g,'').trim();
    const author=body.match(/^(.+?\(\d{4}[^)]*\)\.?)(.*)$/);
    if(author){const strong=document.createElement('strong');strong.textContent=author[1];text.append(strong,document.createTextNode(author[2]));}else text.textContent=body;
    const content=document.createElement('div');content.append(text);
    if(urls.length){
      const source=document.createElement('a');source.className='source-link';source.target='_blank';source.rel='noopener noreferrer';
      source.href=urls[0];source.textContent='Abrir fuente original ↗';source.setAttribute('aria-label',`Abrir fuente original · Referencia ${record.number}`);
      content.append(source);
    }
    entry.append(marker,content);container.append(entry);
  });
}
function renderChapterText(chapter,index) {
  const container=$('#chapter-body');container.replaceChildren();
  if(index===7){renderBibliography(container);return;}
  const blocks=[];
  // Reunir las citas que la extracción del PDF separó del párrafo correspondiente.
  chapter.blocks.forEach(block=>{
    if(block.type==='p'&&/^\[\d+[^\]]*\][.]?$/.test(block.text)&&blocks.at(-1)?.type==='p') blocks.at(-1).text+=' '+block.text;
    else blocks.push({...block});
  });
  let previousHeading='';let orderedList=null;let visualInserted=false;
  blocks.forEach((block,position)=>{
    if(block.type==='h3'){
      orderedList=null;previousHeading=block.text;
      const visual=sectionVisuals[`${index}:${block.text}`];
      if(visual)container.append(createVisualFigure(visual,true));
      const heading=document.createElement('h3');heading.textContent=block.text;container.append(heading);return;
    }
    const numbered=block.text.match(/^[1-6]\.\s+(.+?\.)\s+(.*)$/);
    if(numbered){
      if(!orderedList){orderedList=document.createElement('ol');orderedList.className='narrative-steps';container.append(orderedList);}
      const li=document.createElement('li');const title=document.createElement('strong');title.textContent=numbered[1];li.append(title,document.createTextNode(' '));appendEditorialText(li,numbered[2]);orderedList.append(li);return;
    }
    orderedList=null;
    const label=leadLabels.find(label=>block.text.startsWith(label+'. ')||block.text.startsWith(label+': '));
    if(label){const heading=document.createElement('h4');heading.textContent=label;container.append(heading);}
    const paragraph=document.createElement('p');
    if(index===0&&position===0)paragraph.classList.add('chapter-intro');
    if(previousHeading==='Pregunta central')paragraph.classList.add('research-question');
    if((index===2&&position===blocks.length-1)||block.text.startsWith('El foco está')||block.text.startsWith('Aporte común:'))paragraph.classList.add('key-takeaway');
    appendEditorialText(paragraph,label?block.text.slice(label.length+2):block.text);container.append(paragraph);
    previousHeading='';
    if(!visualInserted && chapterVisuals[index]){container.append(createVisualFigure(chapterVisuals[index]));visualInserted=true;}
  });
  const diagram=createReadingDiagram(index);if(diagram)container.append(diagram);
}
let referenceReturn=null;
function goToReference(number){
  if(activeIndex!==7)referenceReturn={index:activeIndex,scroll:$('#dialog-article').scrollTop,number};
  openChapter(7);focusReference(number);
}
function focusReference(number){
  const reference=document.getElementById(`ref-${number}`);
  if(!reference)return;
  reference.scrollIntoView({block:'start',behavior:'instant'});reference.focus({preventScroll:true});
  history.replaceState(null,'',`#referencias/ref-${number}`);
}
