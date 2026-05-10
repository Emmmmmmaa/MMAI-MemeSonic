import { useState, useRef } from "react";

// API keys from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY || "";
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_KEY || "";

const MEMES = [
  { id:0, img:"/memes/000.png", caption:"GOT NAME?", sentiment:"happiness", intention:"entertaining", script:"I saw now calmly, hey there, got a meme to share. Let's see what you've got." },
  { id:5, img:"/memes/005.png", caption:"Upside down Mr.Potato Head looks exactly like Steve Harvey", sentiment:"happiness", intention:"entertaining", script:"Calmly, check out Mr. Potato Head flipped upside down. He's giving Steve Harvey some serious competition with that look." },
  { id:9, img:"/memes/009.png", caption:"That moment when you still don't know her last name", sentiment:"happiness", intention:"entertaining", script:"And calmly that moment when you realize you still don't know Penny's last name. Classic Big Bang Theory mystery." },
  { id:1, img:"/memes/001.png", caption:"SOME MAGICIANS CAN WALK ON WATER CHUCK NORRIS CAN SWIM THROUGH LAND.", sentiment:"love", intention:"entertaining", script:"Cheerfully, some magicians can walk on water, but Chuck Norris? He swims through land with ease." },
  { id:2, img:"/memes/002.png", caption:"My doors is always open, but i shall never drag you through it.", sentiment:"love", intention:"expressive", script:"Cheerfully, my heart's door is always open, but I'll never force you inside. Enter only when you're truly welcome." },
  { id:11, img:"/memes/011.png", caption:"Remember him? Yeah, he's growing up...", sentiment:"love", intention:"entertaining", script:"Cheerfully, remember this little champion? Time flies, he's growing up right before our eyes." },
  { id:3, img:"/memes/003.png", caption:"I DON'T KNOW WHO YOU ARE I'VE LOST ALL MY PHONE CONTACTS", sentiment:"fear", intention:"entertaining", script:"Nervously. Uh-oh, I have no clue who you are. I accidentally wiped all my contacts." },
  { id:14, img:"/memes/014.png", caption:"CHILL DUDE I ONLY TOOK ONE COOKIE. OKK?", sentiment:"fear", intention:"expressive", script:"Nervously, whoa calm down I swear I just took one cookie okay please don't be mad." },
  { id:26, img:"/memes/026.png", caption:"When you login to your neighbors router using 1234", sentiment:"fear", intention:"entertaining", script:"Nervously sneaking into your neighbour's Wi-Fi feels like walking a tightrope. Exciting, but one wrong step might just expose you." },
  { id:4, img:"/memes/004.png", caption:"I'M DREAMING OF A WHITE CHRISTMAS", sentiment:"sorrow", intention:"expressive", script:"Sadly, wishing for a peaceful, snowy Christmas feels a little bittersweet this year." },
  { id:8, img:"/memes/008.png", caption:"HOW YOU FEEL WHEN IT'S BEEN 500 DAYS WITHOUT NEW GAME OF THRONES", sentiment:"sorrow", intention:"entertaining", script:"Sadly, waiting 500 days without new Game of Thrones episodes feels like endless boredom and growing sadness." },
  { id:13, img:"/memes/013.png", caption:"You can't see me, I am a flower...", sentiment:"sorrow", intention:"entertaining", script:"Sadly, trying to blend in like a shy flower, but those horns give the game away." },
  { id:6, img:"/memes/006.png", caption:"PEOPLE KEPT CALLING ME AVERY BULLOCK FROM AMERICAN DAD", sentiment:"surprise", intention:"entertaining", script:"Surprised. People kept saying I'm Avery Bullock from American Dad. No way!" },
  { id:7, img:"/memes/007.png", caption:"WHAT IF THERE'S MORE TO LIFE THAN TREATS AND CATNIP", sentiment:"surprise", intention:"entertaining", script:"I'm surprised. Wait, what if life is about more than just treats and catnip? Mind blown!" },
  { id:19, img:"/memes/019.png", caption:"Me, A new Spongebob Meme format, The Internet", sentiment:"anger", intention:"expressive", script:"Firmly, here I am caught in the internet's endless chew like a new SpongeBob meme devouring what's left of my patience." },
  { id:29, img:"/memes/029.png", caption:"YOU ARE RUBBISH", sentiment:"anger", intention:"offensive", script:"Firmly. You're nothing but yesterday's garbage. Trash with no value." },
  { id:25, img:"/memes/025.png", caption:"Friends: you should drink less. Me: LESS", sentiment:"hate", intention:"entertaining", script:"Firmly, friends say, drink less, but I'm all about going more, raising the bottle like a warrior charging into battle." },
  { id:35, img:"/memes/035.png", caption:"Edward... you sparkle. I know. That's kind of gay.", sentiment:"hate", intention:"offensive", script:"Firmly, Edward, you sparkle. I know. And that's honestly pretty lame." },
  { id:47, img:"/memes/047.png", caption:"Princess Leia then and now. Feel old yet?", sentiment:"hate", intention:"offensive", script:"Firmly, look at Princess Leia, once a galactic hero, now just a tired old man, feeling ancient yet?" },
];

const SENTIMENTS=["Happiness","Love","Anger","Sorrow","Fear","Hate","Surprise"];
const SK=["happiness","love","anger","sorrow","fear","hate","surprise"];

const MOODS=[
  {id:"default",label:"Default",axis:-1},
  {id:"happiness",label:"Happiness",axis:0},
  {id:"love",label:"Love",axis:1},
  {id:"anger",label:"Anger",axis:2},
  {id:"sorrow",label:"Sorrow",axis:3},
  {id:"fear",label:"Fear",axis:4},
  {id:"hate",label:"Hate",axis:5},
  {id:"surprise",label:"Surprise",axis:6},
];

const CT={emotional_inversion:{l:"Emotional inversion",c:"#7c6bc4"},contextual_subversion:{l:"Contextual subversion",c:"#c4713c"},cultural_reference:{l:"Cultural reference",c:"#3c967c"},absurdist_juxtaposition:{l:"Absurdist juxtaposition",c:"#3c7cc4"},ironic_understatement:{l:"Ironic understatement",c:"#c43c7c"}};
const IX={conflict:{l:"Conflict",c:"#c43c7c"},synergy:{l:"Synergy",c:"#3c967c"},redundancy:{l:"Redundancy",c:"#96783c"}};

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}

function genA(m){
  const si=SK.indexOf(m.sentiment),ci=(si+3)%7;
  const is=SK.map((_,i)=>+(i===si?.35+Math.random()*.2:.04+Math.random()*.1).toFixed(3));
  const ts=SK.map((_,i)=>+(i===ci?.5+Math.random()*.3:i===si?.07+Math.random()*.1:.04+Math.random()*.12).toFixed(3));
  const d=Math.sqrt(is.reduce((s,v,i)=>s+(v-ts[i])**2,0)/7);
  const tps=Object.keys(CT);
  return{is,ts,ct:tps[Math.floor(Math.abs(si*1.7)%tps.length)],
    it:d>.25?"conflict":d>.15?"synergy":"redundancy",
    im:["Calm, composed","Joyful, warm","Warm, gentle","Tense, uneasy","Melancholic, quiet","Hostile, cold","Startled, alert"][si],
    tm:["Anxious, urgent","Playful, light","Aggressive, sharp","Resigned, flat","Panicked, desperate","Bitter, cutting","Confused, lost"][ci],
    fm:["Sarcastic calm","Ironic affection","Tense warmth","Resigned tension","Melancholic panic","Cold bitterness","Bewildered alertness"][si],
    ce:"Image conveys "+["calm","joy","warmth","tension","sadness","hostility","surprise"][si]+" while text suggests "+["anxiety","playfulness","aggression","resignation","panic","bitterness","confusion"][ci]};
}

function Radar({is,ts,fs,vs}){
  const cx=170,cy=170,r=130,n=7;
  const pt=(i,v)=>{const a=Math.PI*2*i/n-Math.PI/2;return[cx+r*v*Math.cos(a),cy+r*v*Math.sin(a)];};
  const poly=s=>s.map((v,i)=>pt(i,v).join(",")).join(" ");
  return(
    <svg viewBox="0 0 340 340" style={{width:"100%"}}>
      {[.25,.5,.75,1].map(l=><polygon key={l} points={Array.from({length:n},(_,i)=>pt(i,l).join(",")).join(" ")} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth=".5"/>)}
      {SENTIMENTS.map((_,i)=>{const[x,y]=pt(i,1);return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(0,0,0,.04)" strokeWidth=".5"/>;})}
      <polygon points={poly(is)} fill="rgba(100,140,220,.1)" stroke="rgba(100,140,220,.6)" strokeWidth="1.5"/>
      <polygon points={poly(ts)} fill="rgba(220,120,80,.1)" stroke="rgba(220,120,80,.6)" strokeWidth="1.5"/>
      <polygon points={poly(fs)} fill="rgba(150,130,220,.08)" stroke="rgba(150,130,220,.5)" strokeWidth="1.5" strokeDasharray="4 2"/>
      <polygon points={poly(vs)} fill="rgba(60,180,140,.16)" stroke="rgba(60,180,140,.8)" strokeWidth="2.5"/>
      {SENTIMENTS.map((l,i)=>{const[x,y]=pt(i,1.22);return<text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="rgba(0,0,0,.35)" fontFamily="system-ui">{l}</text>;})}
      {is.map((v,i)=>{const[x,y]=pt(i,v);return<circle key={"i"+i} cx={x} cy={y} r="3" fill="rgba(100,140,220,.7)"/>;})}
      {ts.map((v,i)=>{const[x,y]=pt(i,v);return<circle key={"t"+i} cx={x} cy={y} r="3" fill="rgba(220,120,80,.7)"/>;})}
      {fs.map((v,i)=>{const[x,y]=pt(i,v);return<circle key={"f"+i} cx={x} cy={y} r="3.5" fill="rgba(150,130,220,.6)"/>;})}
      {vs.map((v,i)=>{const[x,y]=pt(i,v);return<circle key={"v"+i} cx={x} cy={y} r="5" fill="rgba(60,180,140,.85)"/>;})}
    </svg>);
}

export default function App(){
  const[picks,setPicks]=useState(()=>shuffle(MEMES).slice(0,5));
  const[sel,setSel]=useState(null);
  const[data,setData]=useState(null);
  const[moodId,setMoodId]=useState("default");
  const[intensity,setIntensity]=useState(50);
  const[playing,setPlaying]=useState(false);
  const audioRef=useRef(null);

  const stop=()=>{if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;}setPlaying(false);};
  const doShuffle=()=>{setPicks(shuffle(MEMES).slice(0,5));setSel(null);setData(null);stop();};
  const doSelect=m=>{setSel(m);setData(genA(m));setMoodId("default");setIntensity(50);stop();};

  const fs=data?data.is.map((v,i)=>(v+data.ts[i])/2):null;
  const curMood=MOODS.find(m=>m.id===moodId);
  const intF=intensity/100;
  const degreeLabel=intF<.33?"slightly":intF<.66?"moderately":"very";
  const vs=fs?(moodId==="default"?[...fs]:fs.map((v,i)=>{
    const boost = i===curMood.axis ? intF*0.6 : (Math.abs(i-curMood.axis)===1||(curMood.axis===0&&i===6)||(curMood.axis===6&&i===0)) ? intF*0.2 : -intF*0.1;
    return Math.min(1,Math.max(0.02, v + boost));
  })):null;
  const dist=data?Math.sqrt(data.is.reduce((s,v,i)=>s+(v-data.ts[i])**2,0)/7).toFixed(2):"0";

  const[generating,setGenerating]=useState(false);

  const playOriginal=()=>{
    if(!sel)return; stop();
    const id=String(sel.id).padStart(3,"0");
    const a=new Audio(`/audio/${id}_script.mp3`);
    audioRef.current=a;
    a.onplay=()=>setPlaying(true);
    a.onended=()=>setPlaying(false);
    a.onerror=()=>{setPlaying(false);alert("Audio file not found");};
    a.play().catch(()=>setPlaying(false));
  };

  const generateAndPlay=async()=>{
    if(!sel||!ELEVENLABS_API_KEY)return;
    setGenerating(true); stop();
    try{
      // Mood-specific voice settings — extreme differences for audible change
      const moodSettings={
        happiness: { stability:0.15, similarity_boost:0.6, style:1.0, speed:1.15 },
        love:      { stability:0.4,  similarity_boost:0.9, style:0.6, speed:0.85 },
        anger:     { stability:0.1,  similarity_boost:0.5, style:1.0, speed:1.2 },
        sorrow:    { stability:0.5,  similarity_boost:0.8, style:0.8, speed:0.7 },
        fear:      { stability:0.15, similarity_boost:0.6, style:0.9, speed:1.1 },
        hate:      { stability:0.1,  similarity_boost:0.4, style:1.0, speed:0.9 },
        surprise:  { stability:0.1,  similarity_boost:0.5, style:1.0, speed:1.25 },
      };
      const s = moodSettings[moodId] || { stability:0.5, similarity_boost:0.75, style:0.0, speed:1.0 };

      // Wrap script with emotional punctuation cues
      const textMods={
        happiness: sel.script.replace(/\./g,"!").replace(/,/g,"! "),
        anger:     sel.script.toUpperCase() + "!!",
        sorrow:    sel.script.replace(/\./g,"...").replace(/!/g,"..."),
        fear:      sel.script.replace(/\./g,"...?").replace(/,/g,"... "),
        surprise:  sel.script.replace(/\./g,"?!").replace(/,/g,"! "),
        love:      sel.script,
        hate:      sel.script.toUpperCase(),
      };
      const finalText = textMods[moodId] || sel.script;

      const ttsRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
        method: "POST",
        headers: { "Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_KEY },
        body: JSON.stringify({
          text: finalText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: s.stability,
            similarity_boost: s.similarity_boost,
            style: s.style,
            use_speaker_boost: true,
          },
          ...(s.speed !== 1.0 ? { speed: s.speed } : {}),
        })
      });

      if (!ttsRes.ok) { const err = await ttsRes.text(); console.error("ElevenLabs error:", err); setGenerating(false); return; }

      const blob = await ttsRes.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      audioRef.current = a;
      a.onplay = () => setPlaying(true);
      a.onended = () => { setPlaying(false); URL.revokeObjectURL(url); };
      a.onerror = () => { setPlaying(false); URL.revokeObjectURL(url); };
      a.play().catch(() => setPlaying(false));
    }catch(e){console.error("Generate error:",e);}
    setGenerating(false);
  };

  const moodLabel=moodId==="default"?"Default (= Fused)":`${curMood?.label} (${degreeLabel})`;

  return(
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'SF Pro Display','Segoe UI',system-ui,sans-serif",color:"#2a2440",overflow:"hidden"}}>
      {/* Gradient mesh background */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:"60vw",height:"60vw",borderRadius:"50%",top:"-15vw",left:"-10vw",background:"radial-gradient(circle,rgba(200,230,180,.35) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",width:"50vw",height:"50vw",borderRadius:"50%",top:"5vw",right:"-5vw",background:"radial-gradient(circle,rgba(180,230,220,.3) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",width:"45vw",height:"45vw",borderRadius:"50%",top:"20vh",left:"25vw",background:"radial-gradient(circle,rgba(200,180,240,.25) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",width:"40vw",height:"40vw",borderRadius:"50%",bottom:"5vh",left:"10vw",background:"radial-gradient(circle,rgba(240,210,180,.2) 0%,transparent 70%)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",padding:"32px 24px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:12,marginBottom:6}}>
            <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,rgba(127,119,221,.9),rgba(83,74,183,.9))",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <h1 style={{fontSize:30,fontWeight:700,margin:0,letterSpacing:"-0.5px",color:"#2a2440"}}>MemeSonic</h1>
          </div>
          <p style={{fontSize:13,color:"#9994ad",margin:0,letterSpacing:".4px",fontWeight:400}}>Unified affective meme audio generation & retrieval</p>
        </div>

        {/* Explore bar */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",background:"rgba(255,255,255,.7)",backdropFilter:"blur(12px)",borderRadius:16,border:"1px solid rgba(200,195,220,.3)",marginBottom:22}}>
          <span style={{fontSize:10,fontWeight:700,color:"#b5b0cc",textTransform:"uppercase",letterSpacing:"1.5px",flexShrink:0}}>Explore</span>
          <div style={{display:"flex",gap:8,flex:1,justifyContent:"center"}}>
            {picks.map(m=>(
              <div key={m.id} onClick={()=>doSelect(m)} style={{width:54,height:54,borderRadius:12,overflow:"hidden",cursor:"pointer",flexShrink:0,border:sel?.id===m.id?"2.5px solid rgba(127,119,221,.8)":"2px solid rgba(200,195,220,.3)",transition:"all .25s ease",transform:sel?.id===m.id?"scale(1.08)":"scale(1)",boxShadow:sel?.id===m.id?"0 4px 16px rgba(127,119,221,.2)":"none"}}>
                <img src={m.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              </div>
            ))}
          </div>
          <button onClick={doShuffle} style={{fontSize:11,padding:"8px 16px",borderRadius:10,border:"none",background:"rgba(127,119,221,.1)",cursor:"pointer",color:"#7F77DD",fontWeight:600,transition:"all .2s"}}>Shuffle</button>
        </div>

        {!sel&&<div style={{textAlign:"center",padding:"80px 20px",color:"#c8c4da",fontSize:15,fontWeight:500}}>Select a meme to begin</div>}

        {sel&&data&&(<>
          {/* Meme + layers */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <div style={{background:"rgba(255,255,255,.75)",backdropFilter:"blur(12px)",borderRadius:18,border:"1px solid rgba(200,195,220,.25)",overflow:"hidden"}}>
              <img src={sel.img} alt={sel.caption} style={{width:"100%",display:"block"}}/>
              <div style={{fontSize:12,color:"#8a8598",padding:"12px 16px",lineHeight:1.5,fontStyle:"italic",borderTop:"1px solid rgba(200,195,220,.2)"}}>"{sel.caption}"</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"Image",mood:data.im,dot:"rgba(100,140,220,.7)",bg:"rgba(100,140,220,.06)",bc:"rgba(100,140,220,.15)",tc:"rgba(60,100,180,.7)"},
                {label:"Text",mood:data.tm,dot:"rgba(220,120,80,.7)",bg:"rgba(220,120,80,.06)",bc:"rgba(220,120,80,.15)",tc:"rgba(180,80,40,.7)"},
                {label:"Fused",mood:data.fm,dot:"rgba(150,130,220,.7)",bg:"rgba(150,130,220,.06)",bc:"rgba(150,130,220,.15)",tc:"rgba(100,80,180,.7)"},
              ].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:l.bg,border:`1px solid ${l.bc}`}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:l.dot,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:600,color:l.tc,minWidth:42}}>{l.label}</span>
                  <span style={{fontSize:12,color:l.tc,opacity:.8}}>{l.mood}</span>
                </div>
              ))}
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                {IX[data.it]&&<span style={{fontSize:10,padding:"4px 12px",borderRadius:14,background:"rgba(255,255,255,.6)",border:"1px solid rgba(200,195,220,.3)",color:IX[data.it].c,fontWeight:600}}>{IX[data.it].l}</span>}
                {CT[data.ct]&&<span style={{fontSize:10,padding:"4px 12px",borderRadius:14,background:"rgba(255,255,255,.6)",border:"1px solid rgba(200,195,220,.3)",color:CT[data.ct].c,fontWeight:600}}>{CT[data.ct].l}</span>}
              </div>
              <p style={{fontSize:11,color:"#b5b0cc",margin:"4px 0 0"}}>Conflict distance: <span style={{color:"#c0392b",fontWeight:700,fontFamily:"monospace"}}>{dist}</span></p>
              <p style={{fontSize:10,color:"#c8c4da",margin:"2px 0 0",lineHeight:1.4}}>{data.ce}</p>
            </div>
          </div>

          {/* Radar + Mood + Voice */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#b5b0cc",textTransform:"uppercase",letterSpacing:"1.5px",margin:"0 0 8px"}}>Emotion radar</p>
              <div style={{display:"flex",gap:12,fontSize:11,color:"#9994ad",marginBottom:8,flexWrap:"wrap"}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:"rgba(100,140,220,.6)"}}/> Image</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:"rgba(220,120,80,.6)"}}/> Text</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:3,background:"rgba(150,130,220,.5)",borderRadius:2}}/> Fused</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:"rgba(60,180,140,.8)"}}/> <span style={{fontWeight:600}}>Voice</span></span>
              </div>
              <div style={{background:"rgba(255,255,255,.7)",backdropFilter:"blur(12px)",borderRadius:16,padding:"12px 8px",border:"1px solid rgba(200,195,220,.25)"}}>
                <Radar is={data.is} ts={data.ts} fs={fs} vs={vs}/>
              </div>
            </div>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:"#b5b0cc",textTransform:"uppercase",letterSpacing:"1.5px",margin:"0 0 8px"}}>Select mood</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:14}}>
                {MOODS.map(m=>(
                  <button key={m.id} onClick={()=>setMoodId(m.id)}
                    style={{padding:"9px 4px",fontSize:11,border:moodId===m.id?"2px solid rgba(127,119,221,.7)":"1.5px solid rgba(200,195,220,.3)",borderRadius:10,background:moodId===m.id?"rgba(127,119,221,.08)":"rgba(255,255,255,.6)",cursor:"pointer",fontWeight:moodId===m.id?600:400,color:moodId===m.id?"#534AB7":"#9994ad",transition:"all .2s",backdropFilter:"blur(4px)"}}>
                    {m.label}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{fontSize:11,color:"#9994ad",minWidth:52,fontWeight:500}}>Intensity</span>
                <input type="range" min="0" max="100" value={intensity} onChange={e=>setIntensity(+e.target.value)} style={{flex:1,accentColor:"#7F77DD"}}/>
                <span style={{fontSize:12,color:"#534AB7",minWidth:64,textAlign:"right",fontWeight:600}}>{degreeLabel}</span>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button onClick={playing?stop:playOriginal}
                  style={{flex:1,padding:11,border:"none",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .3s",
                    background:playing?"linear-gradient(135deg,rgba(226,75,74,.9),rgba(163,45,45,.9))":"linear-gradient(135deg,rgba(100,140,220,.8),rgba(60,100,180,.8))",color:"#fff"}}>
                  {playing?"Stop":"Play original"}
                </button>
                {moodId!=="default"&&(
                  <button onClick={generating?undefined:generateAndPlay} disabled={generating}
                    style={{flex:1,padding:11,border:"none",borderRadius:10,fontSize:12,fontWeight:600,cursor:generating?"wait":"pointer",transition:"all .3s",
                      background:generating?"rgba(200,195,220,.3)":"linear-gradient(135deg,rgba(60,180,140,.9),rgba(15,110,86,.9))",color:generating?"#9994ad":"#fff"}}>
                    {generating?"Generating...":"Apply mood"}
                  </button>
                )}
              </div>
              <div style={{padding:"12px 16px",background:"rgba(255,255,255,.6)",backdropFilter:"blur(8px)",borderRadius:12,border:"1px solid rgba(200,195,220,.2)"}}>
                <p style={{fontSize:11,color:"#b5b0cc",margin:"0 0 4px"}}>Script</p>
                <p style={{fontSize:13,color:"#4a4560",margin:0,fontStyle:"italic",lineHeight:1.7}}>
                  "{sel.script}"
                </p>
                <p style={{fontSize:10,color:"#c8c4da",margin:"6px 0 0"}}>{moodLabel}</p>
              </div>
            </div>
          </div>
        </>)}

        {/* Footer */}
        <div style={{marginTop:36,paddingTop:18,borderTop:"1px solid rgba(200,195,220,.2)",textAlign:"center"}}>
          <p style={{fontSize:10,color:"#c8c4da",margin:"0 0 4px",letterSpacing:".4px"}}>Meme input → Layer separation → Conflict detection → Mood extraction → Voice generation</p>
          <p style={{fontSize:9,color:"#d8d4ea",margin:0}}>© 2026 Hongbee Park, Ruyi Yang, Yiqiao Huang — MIT MAS.S60 Modeling Multimodal AI</p>
        </div>
      </div>
    </div>
  );
}
