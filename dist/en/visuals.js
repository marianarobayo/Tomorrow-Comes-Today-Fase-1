/* Fotografías ilustrativas con licencia Unsplash; no documentan los casos del PDF. */
'use strict';
const visualAssets = {
  openBook:{file:'open-book.jpg',alt:'An open book with its pages lifted against a dark background',author:'Aaron Burden',url:'https://unsplash.com/photos/open-book-TNlHf4m4gpI',position:'center 52%'},
  conversation:{file:'conversation.jpg',alt:'People gathered in a room beside a column covered with writing and photographs',author:'Mohammadreza Charkhgard',url:'https://unsplash.com/photos/people-sitting-in-a-room-with-writing-on-a-pillar-faxDKoMCM78',position:'center 90%'},
  correspondence:{file:'correspondence.jpg',alt:'Envelopes with wax seals, writing tools, and a typewriter arranged on a table',author:'Ranurte',url:'https://unsplash.com/photos/envelopes-typewriter-and-wax-seals-are-arranged-Prtz_RA7jvA',position:'center 50%'},
  handwriting:{file:'handwriting.jpg',alt:'A close-up of hands writing on a sheet of paper with a fountain pen',author:'Shutter Speed',url:'https://unsplash.com/photos/hand-writing-with-a-fountain-pen-on-paper-rz_0EzMAmis',position:'center 50%'},
  letters:{file:'letters.jpg',alt:'Handwritten letters and stamped envelopes preserved on a table',author:'Olha Vilkha',url:'https://unsplash.com/photos/a-pile-of-old-letters-sitting-on-top-of-a-table-OlS6Bhba4Mk',position:'center 50%'},
  surveillance:{file:'surveillance.jpg',alt:'Two people in front of a building covered with cameras pointing in different directions',author:'Matthew Henry',url:'https://unsplash.com/photos/fPxOowbR6ls',position:'center 65%'},
  phone:{file:'phone.jpg',alt:'A hand browsing a news feed on a phone in the dark',author:'Call Me Fred',url:'https://unsplash.com/photos/a-person-holding-a-cell-phone-in-their-hand-HqcORI4jU9w',position:'center 52%'},
  community:{file:'community.jpg',alt:'Several people bringing their hands together in the center of a circle',author:'Zacqueline Baldwin',url:'https://unsplash.com/photos/a-group-of-people-putting-their-hands-together-K7IvqBpE5uY',position:'center 48%'},
  newspapers:{file:'newspapers.jpg',alt:'Stacks of printed newspapers ready for distribution',author:'Thomas Charters',url:'https://unsplash.com/photos/shallow-focus-photography-of-piles-of-newspapers-zAi2Is48-MA',position:'center 48%'},
  typewriter:{file:'typewriter.jpg',alt:'A written sheet of paper held in a typewriter’s roller',author:'Nik',url:'https://unsplash.com/photos/white-printer-paper-on-typewriter-DEPFptzwsAQ',position:'center 50%'},
  archive:{file:'archive.jpg',alt:'Old books preserved in wooden shelves behind glass doors',author:'MIROV',url:'https://unsplash.com/photos/stacks-of-old-books-on-wooden-shelves-sFYPcbgwu8s',position:'center 45%'},
  library:{file:'library.jpg',alt:'A library holding books of different sizes and periods on long shelves',author:'Unsplash',url:'https://unsplash.com',position:'center 50%'}
};
const chapterVisuals = [
  {asset:'surveillance',title:'Speaking under a constant gaze',caption:'The image evokes the scenario’s tension: addressing a community while another reader watches.'},
  {asset:'phone',title:'The channel also shapes what we see',caption:'Publishing and reaching an audience are different processes. The channel’s rules influence expression.'},
  {asset:'community',title:'Understanding is sustained between people',caption:'Sharing a code requires relationships, learning, and trust; knowing the words is not always enough.'},
  {asset:'newspapers',title:'A voice needs a medium to circulate',caption:'Between an experience and its recipient are media, decisions, and people who enable or shape access.'},
  {asset:'conversation',title:'Protecting a voice. Preserving belonging.',caption:'The social, community, and human focus connects care for each person with the ability to participate.'},
  {asset:'typewriter',title:'Write. Copy. Circulate.',caption:'A medium can sustain a network of transmission. This image evokes copying; it is not a samizdat document.'},
  {asset:'openBook',title:'Preserving also means passing things on',caption:'Books invite us to consider access and memory: a text’s existence does not guarantee that it can be found or understood.'}
];
const sectionVisuals = {
  '2:Memory needs care':{asset:'letters',title:'Memory needs care',caption:'Preserving a medium is part of the task; the experiences that give it meaning must also be passed on.'},
  '5:Creating a channel and sustaining a network':{asset:'correspondence',title:'The code travels with those who teach it',caption:'Contact, learning, and trust connect different practices without equating their historical contexts.'},
  '6:Preserving an experience and a voice':{asset:'handwriting',title:'The voice continues in other hands',caption:'Writing and its transmission serve here as an image of the continuity explored in the literary works.'}
};
function createVisualFigure(visual,compact=false){
  const asset=visualAssets[visual.asset];
  const figure=document.createElement('figure');figure.className='chapter-visual'+(compact?' chapter-visual-secondary':'');
  const button=document.createElement('button');button.className='visual-open';button.type='button';button.setAttribute('aria-label',`Enlarge image: ${visual.title}`);button.setAttribute('aria-haspopup','dialog');
  const img=document.createElement('img');img.src=`../assets/${asset.file}`;img.alt=asset.alt;img.width=1400;img.height=934;img.loading='eager';img.decoding='async';img.style.objectPosition=asset.position;
  const icon=document.createElement('span');icon.className='visual-expand';icon.textContent='↗';icon.setAttribute('aria-hidden','true');button.append(img,icon);
  button.addEventListener('click',()=>openVisual(visual));
  const caption=document.createElement('figcaption');
  const title=document.createElement('strong');title.textContent=visual.title;
  const text=document.createElement('span');text.className='visual-caption';text.textContent=visual.caption;
  const credit=document.createElement('a');credit.className='visual-credit';credit.href=asset.url;credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent=`ILLUSTRATIVE IMAGE · ${asset.author} / UNSPLASH`;
  caption.append(title,text,credit);figure.append(button,caption);return figure;
}
function openVisual(visual){
  const asset=visualAssets[visual.asset];
  const image=document.querySelector('#expanded-visual');image.src=`../assets/${asset.file}`;image.alt=asset.alt;
  document.querySelector('#visual-title').textContent=visual.title;
  document.querySelector('#visual-description').textContent=visual.caption;
  document.querySelector('#visual-dialog').showModal();
}
function createReadingDiagram(index){
  const diagrams={
    0:{title:'One expression, two readings',labels:['What is experienced','What is said','What the system interprets','What the community understands']},
    3:{title:'The path of a message',labels:['Experience','Adapted expression','System reading','Recipient interpretation']},
    4:{title:'Three dimensions of the focus',labels:['The person · preserving a voice','The community · sharing meanings','Society · being able to participate']}
  };
  const data=diagrams[index];if(!data)return null;
  const figure=document.createElement('figure');figure.className='reading-diagram';
  const caption=document.createElement('figcaption');caption.textContent=data.title;figure.append(caption);
  const flow=document.createElement('ol');
  data.labels.forEach((label,i)=>{const li=document.createElement('li');const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=label;li.append(number,title);flow.append(li);});
  figure.append(flow);return figure;
}
