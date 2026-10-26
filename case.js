'use strict';
(() => {
 const dialog=document.querySelector('#contact-dialog');
 const form=document.querySelector('#contact-form');
 const phone=String(window.MORA_CONFIG?.whatsapp||'').replace(/\D/g,'');
 const configured=/^\d{10,15}$/.test(phone);
 document.querySelector('#year').textContent=new Date().getFullYear();
 document.querySelector('#contact-note').textContent=configured?'Sua mensagem será preparada para continuar no WhatsApp.':'Contato em demonstração: prepare e copie sua mensagem. Nenhum dado será enviado por este formulário.';
 document.querySelector('#contact-submit').textContent=configured?'Conversar no WhatsApp ↗':'Preparar mensagem ↗';
 document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
   form.reset();document.querySelector('#contact-status').textContent='';document.querySelector('#prepared-message').hidden=true;
   dialog.showModal();document.body.classList.add('modal-open');
 }));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
 form.addEventListener('submit',async event=>{
   event.preventDefault();const data=new FormData(form);
   const text=`Olá, sou ${String(data.get('name')).trim()}. Conheci o case MORA e quero conversar sobre um projeto para minha imobiliária.\n\n${String(data.get('message')).trim()}`;
   if(configured){window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');document.querySelector('#contact-status').textContent='Continue sua mensagem no WhatsApp.';return;}
   const output=document.querySelector('#prepared-message');output.value=text;output.hidden=false;
   try{await navigator.clipboard.writeText(text);document.querySelector('#contact-status').textContent='Mensagem copiada. Nenhum dado foi enviado.';}catch{output.focus();output.select();document.querySelector('#contact-status').textContent='Mensagem pronta para copiar abaixo.';}
 });
 const menu=document.querySelector('.menu-toggle'),links=document.querySelector('#nav-links');
 const closeMenu=()=>{menu.setAttribute('aria-expanded','false');links.classList.remove('open');};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open);});
 links.querySelectorAll('a,button').forEach(link=>link.addEventListener('click',closeMenu));
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
})();
