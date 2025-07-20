const apiUrl = 'https://t2i.mcpcore.xyz/api/free/generate';
const output = document.getElementById('output');
const ad = document.getElementById('ad');
let lastAd = Date.now();

document.getElementById('generate').onclick = async () => {
  const prompt = document.getElementById('prompt').value;
  if (!prompt) return alert('Décris ton image.');
  output.innerHTML = 'Génération…';
  try {
    const resp = await fetch(apiUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt,model:'turbo'}) });
    if (!resp.ok) throw new Error('Erreur serveur');
    const reader = resp.body.pipeThrough(new TextDecoderStream());
    let imageUrl = '';
    for await(const chunk of reader){
      const lines = chunk.split('\n').filter(l=>l.startsWith('data: '));
      lines.forEach(l=>{
        const data = JSON.parse(l.slice(6));
        if(data.status==='complete') imageUrl = data.imageUrl;
      });
    }
    output.innerHTML = imageUrl ? `<img src="${imageUrl}" alt="Génération IA">` : 'Erreur génération.';
    showAdIfNeeded();
  } catch(e){ output.innerText = 'Erreur: '+e.message; }
};

function showAdIfNeeded(){
  if(Date.now() - lastAd >= 10*60*1000){
    ad.innerText = '🪄 Pub (régie à intégrer)';
    lastAd = Date.now();
    setTimeout(()=>ad.innerText='🕒 Pub toutes les 10 min',8000);
  }
}
setInterval(showAdIfNeeded,60*1000);
