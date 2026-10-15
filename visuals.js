/* Fotografías ilustrativas con licencia Unsplash; no documentan los casos del PDF. */
'use strict';
const visualAssets = {
  openBook:{file:'open-book.jpg',alt:'Un libro abierto con las páginas levantadas sobre un fondo oscuro',author:'Aaron Burden',url:'https://unsplash.com/photos/open-book-TNlHf4m4gpI',position:'center 52%'},
  conversation:{file:'conversation.jpg',alt:'Personas reunidas en una sala junto a una columna con escritura y fotografías',author:'Mohammadreza Charkhgard',url:'https://unsplash.com/photos/people-sitting-in-a-room-with-writing-on-a-pillar-faxDKoMCM78',position:'center 90%'},
  correspondence:{file:'correspondence.jpg',alt:'Sobres con sellos de cera, útiles de escritura y una máquina de escribir sobre una mesa',author:'Ranurte',url:'https://unsplash.com/photos/envelopes-typewriter-and-wax-seals-are-arranged-Prtz_RA7jvA',position:'center 50%'},
  handwriting:{file:'handwriting.jpg',alt:'Primer plano de unas manos escribiendo con una pluma sobre una hoja de papel',author:'Shutter Speed',url:'https://unsplash.com/photos/hand-writing-with-a-fountain-pen-on-paper-rz_0EzMAmis',position:'center 50%'},
  letters:{file:'letters.jpg',alt:'Cartas manuscritas y sobres con sellos conservados sobre una mesa',author:'Olha Vilkha',url:'https://unsplash.com/photos/a-pile-of-old-letters-sitting-on-top-of-a-table-OlS6Bhba4Mk',position:'center 50%'},
  surveillance:{file:'surveillance.jpg',alt:'Dos personas ante una fachada cubierta de cámaras orientadas en distintas direcciones',author:'Matthew Henry',url:'https://unsplash.com/photos/fPxOowbR6ls',position:'center 65%'},
  phone:{file:'phone.jpg',alt:'Una mano consulta un muro de noticias en un teléfono, rodeado de oscuridad',author:'Call Me Fred',url:'https://unsplash.com/photos/a-person-holding-a-cell-phone-in-their-hand-HqcORI4jU9w',position:'center 52%'},
  community:{file:'community.jpg',alt:'Varias personas unen sus manos en el centro de un círculo',author:'Zacqueline Baldwin',url:'https://unsplash.com/photos/a-group-of-people-putting-their-hands-together-K7IvqBpE5uY',position:'center 48%'},
  newspapers:{file:'newspapers.jpg',alt:'Montones de periódicos impresos apilados para su distribución',author:'Thomas Charters',url:'https://unsplash.com/photos/shallow-focus-photography-of-piles-of-newspapers-zAi2Is48-MA',position:'center 48%'},
  typewriter:{file:'typewriter.jpg',alt:'Una hoja escrita permanece en el rodillo de una máquina de escribir',author:'Nik',url:'https://unsplash.com/photos/white-printer-paper-on-typewriter-DEPFptzwsAQ',position:'center 50%'},
  archive:{file:'archive.jpg',alt:'Libros antiguos conservados en una estantería de madera con puertas de cristal',author:'MIROV',url:'https://unsplash.com/photos/stacks-of-old-books-on-wooden-shelves-sFYPcbgwu8s',position:'center 45%'},
  library:{file:'library.jpg',alt:'Una biblioteca conserva libros de diferentes tamaños y épocas en largas estanterías',author:'Unsplash',url:'https://unsplash.com',position:'center 50%'}
};
const chapterVisuals = [
  {asset:'surveillance',title:'Hablar bajo una mirada constante',caption:'La imagen plantea la tensión del escenario: dirigirse a una comunidad mientras otro lector observa.'},
  {asset:'phone',title:'El canal también decide qué vemos',caption:'Publicar y llegar a una audiencia son procesos distintos. Las reglas del canal influyen en la expresión.'},
  {asset:'community',title:'La comprensión se sostiene entre personas',caption:'Compartir un código requiere vínculos, aprendizaje y confianza; conocer las palabras no siempre es suficiente.'},
  {asset:'newspapers',title:'Una voz necesita un medio para circular',caption:'Entre la experiencia y su destinatario hay soportes, decisiones y personas que facilitan o condicionan el acceso.'},
  {asset:'conversation',title:'Proteger la voz. Mantener la pertenencia.',caption:'El foco social, comunitario y humano conecta el cuidado de cada persona con la posibilidad de participar.'},
  {asset:'typewriter',title:'Escribir. Copiar. Hacer circular.',caption:'Un soporte puede sostener una red de transmisión. Imagen evocadora de la copia; no es un documento de samizdat.'},
  {asset:'openBook',title:'Conservar también significa transmitir',caption:'Los libros permiten pensar el acceso y la memoria: que un texto exista no garantiza encontrarlo ni comprenderlo.'}
];
const sectionVisuals = {
  '2:La memoria necesita cuidado':{asset:'letters',title:'Una memoria que necesita cuidados',caption:'Conservar un soporte es una parte de la tarea; también hay que transmitir las experiencias que le dan sentido.'},
  '5:Crear un canal y mantener una red':{asset:'correspondence',title:'El código viaja con quienes lo enseñan',caption:'El contacto, el aprendizaje y la confianza conectan prácticas diferentes, sin equiparar sus contextos históricos.'},
  '6:Conservar una experiencia y una voz':{asset:'handwriting',title:'La voz continúa en otras manos',caption:'La escritura y su transmisión sirven aquí como imagen de la continuidad que exploran las obras literarias.'}
};
function createVisualFigure(visual,compact=false){
  const asset=visualAssets[visual.asset];
  const figure=document.createElement('figure');figure.className='chapter-visual'+(compact?' chapter-visual-secondary':'');
  const button=document.createElement('button');button.className='visual-open';button.type='button';button.setAttribute('aria-label',`Ampliar imagen: ${visual.title}`);button.setAttribute('aria-haspopup','dialog');
  const img=document.createElement('img');img.src=`assets/${asset.file}`;img.alt=asset.alt;img.width=1400;img.height=934;img.loading='eager';img.decoding='async';img.style.objectPosition=asset.position;
  const icon=document.createElement('span');icon.className='visual-expand';icon.textContent='↗';icon.setAttribute('aria-hidden','true');button.append(img,icon);
  button.addEventListener('click',()=>openVisual(visual));
  const caption=document.createElement('figcaption');
  const title=document.createElement('strong');title.textContent=visual.title;
  const text=document.createElement('span');text.className='visual-caption';text.textContent=visual.caption;
  const credit=document.createElement('a');credit.className='visual-credit';credit.href=asset.url;credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent=`IMAGEN ILUSTRATIVA · ${asset.author} / UNSPLASH`;
  caption.append(title,text,credit);figure.append(button,caption);return figure;
}
function openVisual(visual){
  const asset=visualAssets[visual.asset];
  const image=document.querySelector('#expanded-visual');image.src=`assets/${asset.file}`;image.alt=asset.alt;
  document.querySelector('#visual-title').textContent=visual.title;
  document.querySelector('#visual-description').textContent=visual.caption;
  document.querySelector('#visual-dialog').showModal();
}
function createReadingDiagram(index){
  const diagrams={
    0:{title:'Una expresión, dos lecturas',labels:['Lo que se vive','Lo que se dice','Lo que interpreta el sistema','Lo que entiende la comunidad']},
    3:{title:'El recorrido del mensaje',labels:['Experiencia','Expresión adaptada','Lectura del sistema','Interpretación del destinatario']},
    4:{title:'Tres dimensiones del foco',labels:['La persona · conservar una voz','La comunidad · compartir significados','La sociedad · poder participar']}
  };
  const data=diagrams[index];if(!data)return null;
  const figure=document.createElement('figure');figure.className='reading-diagram';
  const caption=document.createElement('figcaption');caption.textContent=data.title;figure.append(caption);
  const flow=document.createElement('ol');
  data.labels.forEach((label,i)=>{const li=document.createElement('li');const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=label;li.append(number,title);flow.append(li);});
  figure.append(flow);return figure;
}
