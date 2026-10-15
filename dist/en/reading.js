/* Tratamiento editorial del texto y navegación entre citas y bibliografía. */
'use strict';
const keyIdeas = ["automatic risk signals", "dialects of resistance", "speaking to two readers at once", "retain its meaning for the community", "the need to be found", "adapted their messages in anticipation of possible restrictions", "does not establish that every modification prevents a penalty", "Changing letters does not guarantee that the meaning will go unrecognized", "both word forms and meanings", "snowball searching", "classification has consequences", "remain decisions made by people and organizations", "its rules influence the words people choose", "before receiving a penalty", "recognize others who share their situation", "Adaptation needs to keep evolving", "maintain understanding, trust, and the memory of experiences", "understand and question the rules", "before a message becomes visible", "what to share, with whom, and when", "Silence needs to be interpreted in context", "time, relationships, and resources", "a barrier to entry", "passing on the experiences and restrictions", "too ambiguous", "Ambiguity serves different purposes", "teaching without unnecessary exposure", "do not show that removing a name erases an idea", "harder to name, recognize, and pass on publicly", "establish rules, priorities, and consequences", "do not necessarily amount to understanding a speaker's intent", "not the same for everyone", "access to meaning as well as access to the message", "text, speech, videos, captions, and images", "making a message unreadable and hiding its existence", "The medium shapes what survives circulation", "experience → adapted expression → system reading → recipient interpretation", "who establishes risk categories", "without unfairly restricting legitimate conversations", "build belonging", "whether people still recognize themselves", "be understood in public conversation", "express something indirectly", "social, community, and human dimensions", "without treating every context as the same situation", "verbal and visual substitution", "humor and belonging", "professional routines", "shared context", "another meaning for someone who knows the rule", "different things to different readers", "establish contact and teach the code", "Personal trust sustained the network", "space and resources to circulate it", "words, shared knowledge, available media, and people who teach and pass things on", "finding and understanding it can be impossible", "having a text does not guarantee understanding it", "what some people discard may be exactly what others need", "different meanings depending on the reader's language", "do not necessarily share the same reading", "a guide to describing reality", "Assigning a label does not resolve the meaning", "express and remember other versions", "preserving the history of the rules", "a community that passes things on", "a voice of one's own"];
const leadLabels = ["Scale", "Dependence on visibility", "Uncertainty", "The need to communicate and belong", "Circulation and learning", "Those who define what is acceptable", "Those who prepare and apply classification", "Those being observed", "Those who sustain communication", "Political", "Ethical", "Social and community", "Human and individual", "Civic and participatory", "Poetic", "Algospeak", "Leetspeak and hacker slang", "Adapted journalism", "Aesopian language", "Cockney rhyming slang", "HK system letters", "Tap code", "Samizdat", "Zines", "Tlön, Uqbar, Orbis Tertius", "The Analytical Language of John Wilkins", "1984", "Animal Farm", "Fahrenheit 451", "The Unnamable"];
const referenceRecords = [];
let referenceRecord;
chapters[7].blocks.forEach(block => {
  if (block.type === 'h3') {
    referenceRecord = null;
    if (block.text !== 'Academic and bibliographic references') referenceRecords.push({heading:block.text});
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
        link.setAttribute('aria-label',`View reference ${n}`);link.title=`Reference ${n} · ${part}`;
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
    const back=document.createElement('button');back.className='reference-return';back.textContent=`← Back to “${chapters[referenceReturn.index].name}”`;
    back.addEventListener('click',()=>{
      const saved=referenceReturn;openChapter(saved.index);$('#dialog-article').scrollTop=saved.scroll;
      const citation=[...document.querySelectorAll('.citation-link')].find(link=>link.getAttribute('href')===`#referencias/ref-${saved.number}`);
      citation?.focus({preventScroll:true});referenceReturn=null;
    });container.append(back);
  }
  referenceRecords.forEach(record=>{
    if(record.heading){const heading=document.createElement('h3');heading.textContent=record.heading;container.append(heading);return;}
    const entry=document.createElement('section');entry.className='bibliography-entry';entry.id=`ref-${record.number}`;entry.tabIndex=-1;entry.setAttribute('aria-label',`Reference ${record.number}`);
    const marker=document.createElement('span');marker.className='reference-number';marker.textContent=String(record.number).padStart(2,'0');
    const text=document.createElement('p');
    const urls=record.text.match(/https?:\/\/[^\s]+/g)||[];
    const body=record.text.replace(/https?:\/\/[^\s]+/g,'').trim();
    const author=body.match(/^(.+?\(\d{4}[^)]*\)\.?)(.*)$/);
    if(author){const strong=document.createElement('strong');strong.textContent=author[1];text.append(strong,document.createTextNode(author[2]));}else text.textContent=body;
    const content=document.createElement('div');content.append(text);
    if(urls.length){
      const source=document.createElement('a');source.className='source-link';source.target='_blank';source.rel='noopener noreferrer';
      source.href=urls[0];source.textContent='Open original source ↗';source.setAttribute('aria-label',`Open original source · Reference ${record.number}`);
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
    if(previousHeading==='The central question')paragraph.classList.add('research-question');
    if((index===2&&position===blocks.length-1)||block.text.startsWith('The focus is')||block.text.startsWith('A shared insight:'))paragraph.classList.add('key-takeaway');
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
