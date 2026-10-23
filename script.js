'use strict';
const properties = [
 {id:'horizonte',name:'Casa Horizonte',location:'Canoas · Marechal Rondon',city:'Canoas',purpose:'sale',type:'house',price:1890000,area:248,beds:3,parking:2,image:'assets/casa-horizonte.webp',description:'Linhas contemporâneas, materiais naturais e um jardim que convida a desacelerar. Uma inspiração de casa para quem procura espaço, luz e conexão com o lado de fora.'},
 {id:'jardim',name:'Casa Jardim',location:'Porto Alegre · Vila Assunção',city:'Porto Alegre',purpose:'sale',type:'house',price:2450000,area:310,beds:4,parking:3,image:'assets/casa-jardim.webp',description:'Uma arquitetura de volumes leves, janelas generosas e verde por todos os lados. Uma inspiração para quem imagina receber pessoas queridas e construir uma nova rotina.'},
 {id:'aurora',name:'Apartamento Aurora',location:'Porto Alegre · Moinhos de Vento',city:'Porto Alegre',purpose:'rent',type:'apartment',price:5800,area:112,beds:2,parking:2,image:'assets/interior.webp',description:'Luz natural, texturas acolhedoras e ambientes integrados. Uma inspiração de apartamento para viver com leveza, perto do que faz parte do seu dia.'}
];
const $ = s => document.querySelector(s);
let stored=[];try{stored=JSON.parse(localStorage.getItem('mora-favorites')||'[]')}catch{}
const favorites=new Set(Array.isArray(stored)?stored.filter(id=>properties.some(p=>p.id===id)):[]);
let onlyFavorites=false;
const currency=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function render(){
 const values=new FormData($('#search-form'));
 const query=normalized(String(values.get('query')||'').trim());
 const matches=properties.filter(p=>(values.get('purpose')==='all'||p.purpose===values.get('purpose'))&&(values.get('type')==='all'||p.type===values.get('type'))&&normalized(p.name+' '+p.location).includes(query)&&(!onlyFavorites||favorites.has(p.id)));
 $('#property-grid').innerHTML=matches.map(p=>`<article class="property"><button class="property-picture" data-detail="${p.id}" aria-label="Conhecer ${p.name}"><img src="${p.image}" alt="${p.name}: ${p.type==='house'?'fachada de uma casa contemporânea':'sala de estar iluminada'}" loading="lazy" width="1536" height="1024"></button><span class="property-tag">${p.purpose==='sale'?'À venda':'Para alugar'} · Ilustrativo</span><button class="favorite" data-favorite="${p.id}" aria-label="Favoritar ${p.name}" aria-pressed="${favorites.has(p.id)}">${favorites.has(p.id)?'♥':'♡'}</button><div class="property-info"><div><h3><button data-detail="${p.id}">${p.name}</button></h3><p>⌖ ${p.location}</p></div><span class="price">${currency(p.price)}${p.purpose==='rent'?'/mês':''}</span></div><div class="property-meta"><span>${p.area} m²</span><span>${p.beds} quartos</span><span>${p.parking} vagas</span></div></article>`).join('');
 $('#result-count').textContent=`${matches.length} ${matches.length===1?'lugar para descobrir':'lugares para descobrir'}`;
 $('#empty').hidden=matches.length>0;
}
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open')}
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open')});
});
let selectedProperty=null;
$('#property-grid').addEventListener('click',event=>{
 const favorite=event.target.closest('[data-favorite]');
 if(favorite){const id=favorite.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('mora-favorites',JSON.stringify([...favorites]))}catch{}render();const replacement=document.querySelector(`[data-favorite="${id}"]`);(replacement||$('#favorites-filter')).focus();return}
 const detail=event.target.closest('[data-detail]');if(!detail)return;
 const p=properties.find(p=>p.id===detail.dataset.detail);selectedProperty=p;
 $('#detail-image').src=p.image;$('#detail-image').alt=p.name;$('#property-title').textContent=p.name;$('#detail-location').textContent=p.location;$('#detail-description').textContent=p.description;$('#detail-specs').textContent=`${p.area} m² · ${p.beds} quartos · ${p.parking} vagas`;$('#detail-price').textContent=currency(p.price)+(p.purpose==='rent'?' / mês':'');openDialog($('#property-dialog'));
});
$('#search-form').addEventListener('submit',event=>{event.preventDefault();render()});
$('#search-form').addEventListener('change',render);
$('#search-form input').addEventListener('input',render);
$('#favorites-filter').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;$('#favorites-filter').setAttribute('aria-pressed',String(onlyFavorites));render()});
const phone=String(window.MORA_CONFIG?.whatsapp||'').replace(/\D/g,'');
const configured=/^\d{10,15}$/.test(phone);
$('#contact-note').textContent=configured?'Ao continuar, a mensagem será aberta no WhatsApp. Nenhum dado é enviado por este site.':'Demonstração: o atendimento ainda não está conectado. Você pode preparar e copiar sua mensagem. Nenhum dado será enviado.';
$('#contact-submit').textContent=configured?'Continuar no WhatsApp ↗':'Preparar mensagem ↗';
function contact(property){if($('#property-dialog').open)$('#property-dialog').close();$('#contact-form').reset();$('#contact-status').textContent='';$('#prepared-message').hidden=true;if(property)$('#contact-form textarea[name="message"]').value=`Gostei da proposta de ${property.name} e procuro um imóvel com características semelhantes. Podemos conversar?`;openDialog($('#contact-dialog'))}
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>contact()));
$('#request-property').addEventListener('click',()=>contact(selectedProperty));
$('#contact-form').addEventListener('submit',async event=>{
 event.preventDefault();const data=new FormData(event.target);const message=`Olá, sou ${String(data.get('name')).trim()}. Vim pelo site da MORA.\n\n${String(data.get('message')).trim()}`;
 if(configured){window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');$('#contact-status').textContent='Mensagem preparada. Continue a conversa na janela do WhatsApp.';return}
 $('#prepared-message').value=message;$('#prepared-message').hidden=false;
 try{await navigator.clipboard.writeText(message);$('#contact-status').textContent='Mensagem copiada! Nenhuma informação foi enviada.'}catch{$('#prepared-message').focus();$('#prepared-message').select();$('#contact-status').textContent='Mensagem pronta. Selecione e copie o texto abaixo.'}
});
$('.menu-toggle').addEventListener('click',()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')!=='true';$('.menu-toggle').setAttribute('aria-expanded',String(open));$('#nav-links').classList.toggle('open',open)});
document.querySelectorAll('#nav-links a,#nav-links button').forEach(a=>a.addEventListener('click',()=>{$('#nav-links').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#nav-links').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});
$('#year').textContent=new Date().getFullYear();render();
